const { Engine } = require('../lib');
const _ = require('lodash');

/* global expect */

const rulesTemplate = [
  {
    conditions: {
      all: [
        {
          operator: "regex",
          lhs: "^\\d*\\.?\\d{0,2}$",
          rhs: {
            path: "prop1"
          }
        }
      ]
    }
  }
];

test('regex pass', () => {
  const testDocument = { prop1 : .2 };
  const engine = new Engine( { rules : rulesTemplate } );
  const results = engine.run( testDocument );
  // console.log( JSON.stringify( results, null, 2 ) );
  expect(results).toHaveProperty('success');
  expect(results.success).toBe(true);
});

test('regex fail', () => {
  const testDocument = { prop1 : .221 };
  const rules = _.cloneDeep( rulesTemplate );
  const engine = new Engine( { rules } );
  const results = engine.run( testDocument );
  // console.log( JSON.stringify( results, null, 2 ) );
  expect(results).toHaveProperty('success');
  expect(results.success).toBe(false);
});

