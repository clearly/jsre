const { Engine } = require('../lib');
const fs = require('fs');

/* global expect */

const rules = [
  {
    conditions: {
      all: [
        {
          operator: {
            not: "equal"
          },
          lhs: 2,
          rhs: {
            path: "prop1.prop2.prop3"
          }
        }
      ]
    }
  }
];



test('not rule pass', () => {
  const testDocument = { prop1 : { prop2 : { prop3 : 1 } } };

  const engine = new Engine( { rules } );
  const results = engine.run( testDocument );
  expect(results).toHaveProperty('success');
  expect(results.success).toBe(true);
});


test('not rule fail', () => {
  const testDocument = { prop1 : { prop2 : { prop3 : 2 } } };
  const engine = new Engine( { rules } );
  const results = engine.run( testDocument );
  expect(results).toHaveProperty('success');
  expect(results.success).toBe(false);
  expect(results).toHaveProperty('failures');
  expect(results.failures.length).toBe(1);
});