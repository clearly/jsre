const _ = require('lodash');

module.exports = {
  regex( lhs, rhs, not ) {
    let result = false;
    let regex = null;
    let lhsExpression = null;
    // console.log( { rhs } );
    try {
      lhsExpression = lhs.replace("\\\\", '\\');
      regex = new RegExp( lhsExpression );
    } catch( err ) {
      let msg = "";
      msg += `operator regex: [lhs] is not a valid RegExp. `;
      msg += `[lhs] has a value of [${lhsExpression}]. `;
      msg += `Error message of [${err.message}]. `;
      throw new Error( msg );
    }
    // console.log( { diff } );
    const regexResults = regex.exec( rhs.toString() );
    // console.log( 'regexResults: ', JSON.stringify( regexResults, null, 2 ) );
    result = regexResults == null ? false : true;
    if( not == true ) result = !result;
    return result;
  }
};

