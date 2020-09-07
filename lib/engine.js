const _         = require('lodash');
const yaml      = require('js-yaml');
const fs        = require('fs');
const Ajv       = require('ajv');
const traverse  = require('traverse');
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
      this._binaryRuleCount = traverse( proposedRules ).reduce(function (accum, current) {
        return _.has( current, "operator" ) ? accum + 1 : accum;
      }, 0 );
      this._rules = proposedRules;
    } else {
      throw validate.errors;
    }
  }

  _getValue( value, doc ) {
    let result = null;
    if( _.isObject( value ) && ! _.isArray( value ) ) {
      if( value.path ) {
        result = _.get( doc, value.path, value.default );
      } else if( value.exists ) {
        result = _.has( doc, value.exists );
      }
    } else {
      result = value;  
    }
    return result;
  }
  
  _getOperator( proposedOperator ) {
    let result = { not : false };
    if( _.isObject( proposedOperator ) && _.has( proposedOperator, 'not' ) ) {
      result.method = operators[ proposedOperator.not ];
      result.not = true;
    } else {
      result.method = operators[ proposedOperator ];
    }
    return result;
  }
  
  _runOperator( { condition, doc, operator, index } ) {
    const lhs = this._getValue( condition.lhs, doc );
    const rhs = this._getValue( condition.rhs, doc );
    try {
      let result = operator.method( lhs, rhs, operator.not );
      if( ! _.has( result, 'success' ) ) {
        result = { success : result };
      }
      condition.success     = result.success;
      condition.info        = result.info;
      condition.calculation = { lhs, rhs, not : operator.not };
    } catch( err ) {
      condition.success = false;
      condition.error = {
        operatorError : true,
        message       : err.message
      };
    }
  }
  
  _runSetCondition( { condition, doc, failures, passes, index } ) {
    if( condition.all ) {
      condition.all.map( condition => this._runCondition( { condition, doc, failures, passes, index } ) );
      condition.success = condition.all.reduce( (accum, current) => accum ? current.success : false, true );
    } else if( condition.any ) {
      condition.any.map( condition => this._runCondition( { condition, doc, failures, passes, index } ) );
      condition.success = condition.any.reduce( (accum, current) => accum ? true : current.success, false );
    }
  }
  
  _runBinaryCondition( { condition, index, doc, failures, passes} ) {
    const operator = this._getOperator( condition.operator );
    if( operator.method == null ) {
      condition.success = false;
      condition.error = {
        unknownOperator : true,
        message         : `operator [${condition.operator}] not available`
      };
    } else {
      if( _.has( condition, "depends") ) {
        const dependsList = _.isArray( condition.depends ) ? condition.depends : [ condition.depends ];
        const dependenciesMet = [];
        const dependentsFailed = [];
        for( let dependentId of dependsList ) {
          if( index[ dependentId ] === false ) dependentsFailed.push( dependentId );
          else if ( index[ dependentId ] === true ) dependenciesMet.push( dependentId );
        }
        if( dependentsFailed.length > 0 ) {
          condition.success = false;
          condition.error = {
            unmetDependency : true,
            unmetList       : dependentsFailed,
            message         : `Failed dependencies [${dependentsFailed.join(",")}]`
          };
        } else if( dependenciesMet.length == dependsList.length ) {
          this._runOperator( { condition, doc, operator, index } );
        }
      } else {
        // console.log( JSON.stringify( { condition }, null, 2 ) );
        this._runOperator( { condition, doc, operator, index } );
      }
    }
    
    if( condition.success == false ) {
      failures.push( condition );
    } else {
      passes.push( condition );
    }
    
    if( _.has( condition, "id" ) ) {
      index[ condition.id ] = condition.success;
    }
  }

  _determineCondition( { condition, doc, failures, passes, index } ) {
      if( condition.all || condition.any )
        this._runSetCondition( { condition, doc, failures, passes, index } );
      else
        this._runBinaryCondition( { condition, index, doc, failures, passes } );    
  }
  
  _runCondition( { condition, doc, failures, passes, index } ) {
    if( _.has( condition, "id" ) && index[ condition.id ] == null )
      this._determineCondition( { condition, doc, failures, passes, index } );
    else if ( ! _.has( condition, "id" ) ) {
      this._determineCondition( { condition, doc, failures, passes, index } );
    }
  }
  
  _runRule( { rule, doc, failures, passes, index } ) {
    if( rule.conditions.all ) {
      rule.conditions.all.map( condition => this._runCondition( { condition, doc, failures, passes, index } ) );
      rule.success = rule.conditions.all.reduce( (accum, current) => accum ? current.success : false, true );
    }
    else if( rule.conditions.any ) {
      rule.conditions.any.map( condition => this._runCondition( { condition, doc, failures, passes, index } ) );
      rule.success = rule.conditions.any.reduce( (accum, current) => accum ? true : current.success, false );
    }
  }
  
  run( doc ) {
    const rules     = _.cloneDeep( this._rules );
    const failures  = [];
    const passes    = [];
    const index     = {};
    while( this._binaryRuleCount !== ( failures.length + passes.length ) ) {
      rules.map( rule => this._runRule( { rule, doc, failures, passes, index } ) );
    }
    const result    = { rules, failures, passes };
    result.success  = rules.reduce( (accum, current) => accum ? current.success : false, true );
    return result;
  }
}

module.exports = Engine;