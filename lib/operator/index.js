let operators = {};

Object.assign( operators, require( __dirname + '/equal' ) );
Object.assign( operators, require( __dirname + '/numericComparison' ) );
Object.assign( operators, require( __dirname + '/set' ) );
Object.assign( operators, require( __dirname + '/regex' ) );

module.exports = operators;

