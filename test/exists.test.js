const { Engine } = require('../lib');

/* global expect */

const rules = [
  {
    conditions: {
      all: [
        {
          operator: "equal",
          lhs: true,
          rhs: {
            exists: "prop1.prop2"
          }
        }
      ]
    }
  }
];

test('exists rule pass', () => {
  const testDocument = { prop1 : { prop2 : { prop3 : 1 } } };
  const engine = new Engine( { rules } );
  const results = engine.run( testDocument );
  expect(results).toHaveProperty('success');
  expect(results.success).toBe(true);
});


test('exists rule fail', () => {
  const testDocument = { prop1 : 2 };
  const engine = new Engine( { rules } );
  const results = engine.run( testDocument );
  expect(results).toHaveProperty('success');
  expect(results.success).toBe(false);
  expect(results).toHaveProperty('errors');
  expect(results.errors.length).toBe(1);
});