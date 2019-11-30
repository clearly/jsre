const _ = require('lodash');

module.exports = {
  greaterThan( lhs, rhs, not ) {
    if( ! _.isNumber( lhs ) ) throw new Error( `operator greaterThan: [lhs] value of [${lhs}] and type of [${typeof lhs}] is not a number`);
    if( ! _.isNumber( rhs ) ) throw new Error( `operator greaterThan: [rhs] value of [${rhs}] and type of [${typeof rhs}] is not a number`);
    let result = false;
    result = lhs > rhs;
    if( not == true ) result = !result;
    return result;
  },
  lessThan( lhs, rhs, not = false ) {
    if( ! _.isNumber( lhs ) ) throw new Error( `operator lessThan: [lhs] value of [${lhs}] and type of [${typeof lhs}] is not a number`);
    if( ! _.isNumber( rhs ) ) throw new Error( `operator lessThan: [rhs] value of [${rhs}] and type of [${typeof rhs}] is not a number`);
    let result = false;
    result = lhs < rhs;
    if( not == true ) result = !result;
    return result;
  }
};

