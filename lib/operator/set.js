const _ = require('lodash');

module.exports = {
  in( lhs, rhs, not ) {
    let result = false;
    result = lhs > rhs;
    if( not == true ) result = !result;
    return result;
  }
};

