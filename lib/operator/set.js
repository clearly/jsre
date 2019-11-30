const _ = require('lodash');

module.exports = {
  in( lhs, rhs, not ) {
    let result = false;
    // console.log( { rhs } );
    if( ! _.isArray( rhs ) ) throw new Error( `operator in: [rhs] is not an array. it is of type [${typeof rhs}]`);
    const rhsArray = rhs;
    const lhsArray = _.isArray( lhs ) ? lhs : [ lhs ];
    const diff = _.difference( rhsArray, lhsArray );
    // console.log( { diff } );
    result = diff.length != rhsArray.length;
    if( not == true ) result = !result;
    return result;
  }
};

