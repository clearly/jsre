const { Engine } = require('../lib');
const fs = require('fs');

/* global expect */

const rules = [
  {
    conditions: {
      all: [
        {
          operator: "equal",
          lhs: 1,
          rhs: {
            path: "prop1.prop2.prop3"
          }
        }
      ]
    }
  }
];

test('example rule pass', () => {
  const testDocument = { prop1 : { prop2 : { prop3 : 1 } } };
  const engine = new Engine( { rules } );
  const results = engine.run( testDocument );
  // console.log( JSON.stringify( { results }, null, 2 ) );
  expect(results).toHaveProperty('success');
  expect(results.success).toBe(true);
});


test('example rule fail', () => {
  const testDocument = { prop1 : { prop2 : { prop3 : 2 } } };
  const engine = new Engine( { rules } );
  const results = engine.run( testDocument );
  expect(results).toHaveProperty('success');
  expect(results.success).toBe(false);
  expect(results).toHaveProperty('failures');
  expect(results.failures.length).toBe(1);
});