const { Engine } = require('../lib');

/* global expect */

const rules = [
  {
    conditions: {
      all: [
        {
          operator: "equal",
          lhs: [ "orange", "apple" ],
          rhs: {
            path: "prop1"
          }
        }
      ]
    }
  }
];

test('equal array pass', () => {
  const testDocument = { prop1 : [ "orange", "apple" ] };
  const engine = new Engine( { rules } );
  const results = engine.run( testDocument );
  expect(results).toHaveProperty('success');
  expect(results.success).toBe(true);
});


test('equal array different of order pass', () => {
  const testDocument = { prop1 : [ "apple", "orange" ] };
  const engine = new Engine( { rules } );
  const results = engine.run( testDocument );
  expect(results).toHaveProperty('success');
  expect(results.success).toBe(true);
});

test('equal array fail', () => {
  const testDocument = { prop1 : [ "orange" ] };
  const engine = new Engine( { rules } );
  const results = engine.run( testDocument );
  expect(results).toHaveProperty('success');
  expect(results.success).toBe(false);
});

