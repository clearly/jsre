const { Engine } = require('../lib');
const fs = require('fs');

/* global expect */

test('example rule pass', () => {
  const testDocument = {
    prop1 : {
      prop2 : {
        prop3 : 1
      }
    }
  };
  
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
  
  const engine = new Engine( { rules } );
  const results = engine.run( testDocument );
  expect(results).toHaveProperty('success');
  expect(results.success).toBe(true);
});


test('example rule fail', () => {

  const testDocument = {
    prop1 : {
      prop2 : {
        prop3 : 2
      }
    }
  };
  
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

  const engine = new Engine( { rules } );
  const results = engine.run( testDocument );
  expect(results).toHaveProperty('success');
  expect(results.success).toBe(false);
  expect(results).toHaveProperty('errors');
  expect(results.errors.length).toBe(1);
});