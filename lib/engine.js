const _         = require('lodash');
const yaml      = require('js-yaml');
const fs        = require('fs');
const Ajv       = require('ajv');
const operators = require('./operator'); 

const schema    = yaml.safeLoad( fs.readFileSync( __dirname + '/rulesSchema.yaml' ) );
const ajv       = new Ajv();
const validate  = ajv.compile( schema );

class Engine {
  constructor( { rules = [], options = {}, yamlFile } = {} ) {
    let proposedRules = [];
    if( rules.length == 0 ) {
      if( _.isString( yamlFile ) && yamlFile.length > 0 ) {
        const yamlFileContents = fs.readFileSync( yamlFile, 'utf8' );
        proposedRules = yaml.safeLoad( yamlFileContents );
      }
    } else {
      proposedRules = rules;
    }
    
    const valid = validate( proposedRules );
    if( valid ) {
      this._rules = proposedRules;
    } else {
      throw validate.errors;
    }
  }

  _getValue( value, doc ) {
    let result = null;
    if( _.isObject( value ) ) {
      if( value.path ) {
        result = _.get( doc, value.path, value.default );
      }
    } else {
      result = value;  
    }
    return result;
  }
  
  _runCondition( condition, doc, errors ) {
    if( condition.all || condition.any ) {
      if( condition.all ) {
        condition.all.map( condition => this._runCondition( condition, doc, errors ) );
        condition.success = condition.all.reduce( (accum, current) => accum ? current.success : false, true );
      } else if( condition.any ) {
        condition.any.map( condition => this._runCondition( condition, doc, errors ) );
        condition.success = condition.any.reduce( (accum, current) => accum ? true : current.success, false );
      }
    } else {
      const operator = operators[ condition.operator ];
      if( operator == null ) {
        condition.success = false;
        condition.error = {
          code    : 'E10001',
          message : `operator [${condition.operator}] not avaialble`
        };
      } else {
        const lhs = this._getValue( condition.lhs, doc );
        const rhs = this._getValue( condition.rhs, doc );
        try {
          condition.success = operator( lhs, rhs );
          condition.calculation = { lhs, rhs };
        } catch( err ) {
          condition.success = false;
          condition.error = {
            message : err.message
          };
        }
      }
     if( condition.success == false ) {
       errors.push( condition );
     }
    }
  }
  
  _runRule( { rule, doc, errors } ) {
    if( rule.conditions.all ) {
      rule.conditions.all.map( condition => this._runCondition( condition, doc, errors ) );
      rule.success = rule.conditions.all.reduce( (accum, current) => accum ? current.success : false, true );
    }
    else if( rule.conditions.any ) {
      rule.conditions.any.map( condition => this._runCondition( condition, doc, errors ) );
      rule.success = rule.conditions.any.reduce( (accum, current) => accum ? true : current.success, false );
    }
  }
  
  run( doc ) {
    const rules = JSON.parse( JSON.stringify( this._rules ) );
    const errors = [];
    rules.map( rule => this._runRule( { rule, doc, errors } ) );
    const result = { rules };
    result.success = rules.reduce( (accum, current) => accum ? current.success : false, true );
    if( result.success == false ) {
      result.errors = errors;
    }
    return result;
  }
}

module.exports = Engine;