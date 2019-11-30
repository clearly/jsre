const { Engine } = require('../lib');
const _ = require('lodash');

/* global expect */

const rulesTemplate = [
  {
    conditions: {
      all: [
        {
          operator: "in",
          lhs: { path: "prop1" },
          rhs: [ "apple", "banana", "orange", "kiwi" ]
        }
      ]
    }
  }
];


describe( 'set membership tests', () => {
  test('in operator single value pass', () => {
    const testDocument = { prop1 : "orange" };
    const engine = new Engine( { rules : rulesTemplate } );
    const results = engine.run( testDocument );
    
    // console.log( JSON.stringify( results, null, 2 ) );
    
    expect(results).toHaveProperty('success');
    expect(results.success).toBe(true);
  });

  test('in operator single value fail', () => {
    const testDocument = { prop1 : "mango" };
    const engine = new Engine( { rules: rulesTemplate } );
    const results = engine.run( testDocument );
    
    // console.log( JSON.stringify( results, null, 2 ) );
    
    expect(results).toHaveProperty('success');
    expect(results.success).toBe(false);
  });
  
  test('in operator multiple value pass', () => {
    const testDocument = { prop1 : [ "orange", "apple" ] };
    const engine = new Engine( { rules : rulesTemplate } );
    const results = engine.run( testDocument );
    
    // console.log( JSON.stringify( results, null, 2 ) );
    
    expect(results).toHaveProperty('success');
    expect(results.success).toBe(true);
  });
  
  test('in operator multiple value fail', () => {
    const testDocument = { prop1 : [ "mango", "pineapple" ] };
    const engine = new Engine( { rules: rulesTemplate } );
    const results = engine.run( testDocument );
    
    // console.log( JSON.stringify( results, null, 2 ) );
    
    expect(results).toHaveProperty('success');
    expect(results.success).toBe(false);
  });

});
