const _ = require('lodash');

module.exports = {
  equal( lhs, rhs ) {
    let result = false;
    result = _.isEqual( lhs, rhs );
    return result;
  }
};

