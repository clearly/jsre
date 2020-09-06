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

test('bad regex specification fail', () => {
  const testDocument = { prop1 : .221 };
  const rules = _.cloneDeep( rulesTemplate );
  rules[ 0 ].conditions.all[ 0 ].lhs = "sel/\\";
  const engine = new Engine( { rules } );
  const results = engine.run( testDocument );
  // console.log( JSON.stringify( results, null, 2 ) );
  expect(results).toHaveProperty('success');
  expect(results.success).toBe(false);
});

test('regex capture', () => {
  const testDocument = { prop1 : "Log: WinSock: version 1.1 (2.2), MaxSocks=32767" };
  const rules = _.cloneDeep( rulesTemplate );
  rules[ 0 ].conditions.all[ 0 ].lhs = "Log: WinSock: version ([^ ]+) \\(([^ ]+)\\), MaxSocks=(\\d+)";
  const engine = new Engine( { rules } );
  const results = engine.run( testDocument );
  // console.log( JSON.stringify( results, null, 2 ) );
  expect(results).toHaveProperty( 'success' );
  expect(results.success).toBe( true );
  expect(results).toHaveProperty( 'rules' );
  expect(results.rules[ 0 ].conditions.all[ 0 ].info ).toEqual(
    expect.arrayContaining([ "1.1", "2.2", "32767" ]),
  );  
});
