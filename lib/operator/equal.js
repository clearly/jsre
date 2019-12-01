const _ = require('lodash');

module.exports = {
  equal( lhs, rhs, not ) {
    let result = false;
    let lhsValue = _.isArray( lhs ) ? _.cloneDeep( lhs ).sort() : lhs;
    let rhsValue = _.isArray( rhs ) ? _.cloneDeep( rhs ).sort() : rhs;
    result = _.isEqual( lhsValue, rhsValue );
    if( not == true ) result = !result;
    return result;
  }
};

