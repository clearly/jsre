const { Engine } = require('../lib');
const _ = require('lodash');

/* global expect */

const rulesAllAny = [
  {
    conditions: {
      all: [
        {
          any : [
            {
              operator: "lessThan",
              lhs: {
                path: "prop1"
              },
              rhs: {
                path: "prop2"
              }
            },
            {
              operator: "greaterThan",
              lhs: 1,
              rhs: {
                path: "prop2"
              }
            }
          ]
        }
      ]
    }
  }
];



const rulesAnyAll = [
  {
    conditions: {
      any: [
        {
          all : [
            {
              operator: "lessThan",
              lhs: {
                path: "prop1"
              },
              rhs: {
                path: "prop2"
              }
            },
            {
              operator: "greaterThan",
              lhs: 10,
              rhs: {
                path: "prop2"
              }
            }
          ]
        },
        {
          operator: "greaterThan",
          lhs: 1,
          rhs: {
            path: "prop2"
          }
        }
      ]
    }
  }
];



describe( 'Nested conditions test', () => {
  test('conditions.all.any rule pass', () => {
    const testDocument = { prop1 : 1, prop2 : 4 };
    const engine = new Engine( { rules: rulesAllAny } );
    const results = engine.run( testDocument );
    
    expect(results).toHaveProperty('success');
    expect(results.success).toBe(true);

    expect(results.rules[0].conditions.all[0].any[0].success).toBe(true);
    expect(results.rules[0].conditions.all[0].any[1].success).toBe(false);
  });

  test('conditions.any.all rule pass', () => {
    const testDocument = { prop1 : 1, prop2 : 4 };
    const engine = new Engine( { rules: rulesAnyAll } );
    const results = engine.run( testDocument );

    expect(results).toHaveProperty('success');
    expect(results.success).toBe(true);
    expect(results.rules[0].conditions.any[1].success).toBe(false);
    expect(results.rules[0].conditions.any[0].all[0].success).toBe(true);
    expect(results.rules[0].conditions.any[0].all[1].success).toBe(true);
  });

  
});

