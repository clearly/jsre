const { Engine } = require('../lib');
const fs = require('fs');
const _ = require('lodash');

const rulesTemplate = [
  {
    conditions: {
      all: [
        {
          operator: "greaterThan",
          lhs: 1,
          rhs: {
            path: "prop1"
          }
        }
      ]
    }
  }
];

const rulesAnyTemplate = [
  {
    conditions: {
      any: [
        {
          operator: "greaterThan",
          lhs: 1,
          rhs: {
            path: "prop1"
          }
        },
        {
          operator: "equal",
          lhs: 1,
          rhs: {
            path: "prop1"
          }
        }
      ]
    }
  }
];



/* global expect */
describe('numeric comparisons', () => {
  test('greaterThan pass', () => {
    const testDocument = { prop1 : 1 };
    const rules = _.cloneDeep( rulesTemplate );
    rules[ 0 ].conditions.all[0].lhs = 2;
    
    const engine = new Engine( { rules } );
    const results = engine.run( testDocument );
    expect(results).toHaveProperty('success');
    expect(results.success).toBe(true);
  });

  test('greaterThan or equal to pass', () => {
    const testDocument = { prop1 : 1 };
    const rules = _.cloneDeep( rulesAnyTemplate );

    const engine = new Engine( { rules } );
    const results = engine.run( testDocument );
    expect(results).toHaveProperty('success');
    expect(results.success).toBe(true);
    expect(results).toHaveProperty('rules');
    expect(results.rules.length).toBe(1);
    expect(results.rules[0]).toHaveProperty('conditions');
    expect(results.rules[0].conditions).toHaveProperty('any');
    expect(results.rules[0].conditions.any.length).toBe(2);
    expect(results.rules[0].conditions.any[0]).toHaveProperty('success');
    expect(results.rules[0].conditions.any[0].success).toBe(false);
    expect(results.rules[0].conditions.any[1]).toHaveProperty('success');
    expect(results.rules[0].conditions.any[1].success).toBe(true);
  });
  
  
  test('lessThan pass', () => {
    const testDocument = { prop1 : 2 };
    const rules = _.cloneDeep( rulesTemplate );
    rules[ 0 ].conditions.all[0].operator = "lessThan";
    rules[ 0 ].conditions.all[0].lhs = 1;

    const engine = new Engine( { rules } );
    const results = engine.run( testDocument );
    expect(results).toHaveProperty('success');
    expect(results.success).toBe(true);
    expect(results).toHaveProperty('rules');
  });
  
  test('greaterThan or equal to pass', () => {
    const testDocument = { prop1 : 1 };
    const rules = _.cloneDeep( rulesAnyTemplate );

    const engine = new Engine( { rules } );
    const results = engine.run( testDocument );
    expect(results).toHaveProperty('success');
    expect(results.success).toBe(true);
    expect(results).toHaveProperty('rules');
    expect(results.rules.length).toBe(1);
    expect(results.rules[0]).toHaveProperty('conditions');
    expect(results.rules[0].conditions).toHaveProperty('any');
    expect(results.rules[0].conditions.any.length).toBe(2);
    expect(results.rules[0].conditions.any[0]).toHaveProperty('success');
    expect(results.rules[0].conditions.any[0].success).toBe(false);
    expect(results.rules[0].conditions.any[1]).toHaveProperty('success');
    expect(results.rules[0].conditions.any[1].success).toBe(true);
  });
  
  test('lessThan or equal to pass', () => {
    const testDocument = { prop1 : 1 };
    const rules = _.cloneDeep( rulesAnyTemplate );
    rules[0].conditions.any[0].operator = 'lessThan';

    const engine = new Engine( { rules } );
    const results = engine.run( testDocument );
    expect(results).toHaveProperty('success');
    expect(results.success).toBe(true);
    expect(results).toHaveProperty('rules');
    expect(results.rules.length).toBe(1);
    expect(results.rules[0]).toHaveProperty('conditions');
    expect(results.rules[0].conditions).toHaveProperty('any');
    expect(results.rules[0].conditions.any.length).toBe(2);
    expect(results.rules[0].conditions.any[0]).toHaveProperty('success');
    expect(results.rules[0].conditions.any[0].success).toBe(false);
    expect(results.rules[0].conditions.any[1]).toHaveProperty('success');
    expect(results.rules[0].conditions.any[1].success).toBe(true);
  });
  
  test('not greaterThan pass', () => {
    const testDocument = { prop1 : 1 };
    const rules = _.cloneDeep( rulesTemplate );
    rules[ 0 ].conditions.all[0].operator = { not : "greaterThan" };
    
    const engine = new Engine( { rules } );
    const results = engine.run( testDocument );
    expect(results).toHaveProperty('success');
    expect(results.success).toBe(true);
  });

  test('not greaterThan fail', () => {
    const testDocument = { prop1 : 0 };
    const rules = _.cloneDeep( rulesTemplate );
    rules[ 0 ].conditions.all[0].operator = { not : "greaterThan" };
    
    const engine = new Engine( { rules } );
    const results = engine.run( testDocument );
    expect(results).toHaveProperty('success');
    expect(results.success).toBe(false);
  });
  
  test('not lessThan pass', () => {
    const testDocument = { prop1 : 1 };
    const rules = _.cloneDeep( rulesTemplate );
    rules[ 0 ].conditions.all[0].operator = { not : "lessThan" };
    
    const engine = new Engine( { rules } );
    const results = engine.run( testDocument );
    expect(results).toHaveProperty('success');
    expect(results.success).toBe(true);
  });

  test('not lessThan fail', () => {
    const testDocument = { prop1 : 2 };
    const rules = _.cloneDeep( rulesTemplate );
    rules[ 0 ].conditions.all[0].operator = { not : "lessThan" };
    
    const engine = new Engine( { rules } );
    const results = engine.run( testDocument );
    expect(results).toHaveProperty('success');
    expect(results.success).toBe(false);
  });
  
  test('greaterThan only accepts numerics', () => {
    const testDocument = { prop1 : "1" };
    const rules = _.cloneDeep( rulesTemplate );

    const engine = new Engine( { rules } );
    const results = engine.run( testDocument );
    
    expect(results).toHaveProperty('success');
    expect(results.success).toBe(false);
    expect(results).toHaveProperty('failures');
    expect(results.failures).toHaveProperty('length');
    expect(results.failures.length).toBe(1);
    expect(results.failures[0]).toHaveProperty('error');
    expect(results.failures[0].error).toHaveProperty('operatorError');
    expect(results.failures[0].error.operatorError).toBe(true);
  });
  
  test('greaterThan does not accept a null value', () => {
    const testDocument = { prop1 : null };
    const rules = _.cloneDeep( rulesTemplate );

    const engine = new Engine( { rules } );
    const results = engine.run( testDocument );
    
    expect(results).toHaveProperty('success');
    expect(results.success).toBe(false);
    expect(results).toHaveProperty('failures');
    expect(results.failures).toHaveProperty('length');
    expect(results.failures.length).toBe(1);
    expect(results.failures[0]).toHaveProperty('error');
    expect(results.failures[0].error).toHaveProperty('operatorError');
    expect(results.failures[0].error.operatorError).toBe(true);
  });  

  test('greaterThan does not accept a missing property', () => {
    const testDocument = {};
    const rules = _.cloneDeep( rulesTemplate );

    const engine = new Engine( { rules } );
    const results = engine.run( testDocument );
    
    // console.log( JSON.stringify( results, null, 2 ) );
    
    expect(results).toHaveProperty('success');
    expect(results.success).toBe(false);
    expect(results).toHaveProperty('failures');
    expect(results.failures).toHaveProperty('length');
    expect(results.failures.length).toBe(1);
    expect(results.failures[0]).toHaveProperty('error');
    expect(results.failures[0].error).toHaveProperty('operatorError');
    expect(results.failures[0].error.operatorError).toBe(true);
  });
  
  test('lessThan floating point pass', () => {
    const testDocument = { prop1 : 2.000000000000000000000002 };
    const rules = _.cloneDeep( rulesTemplate );
    rules[ 0 ].conditions.all[0].lhs = 1.000000000000000000000001;
    rules[ 0 ].conditions.all[0].operator = 'lessThan';
    
    const engine = new Engine( { rules } );
    const results = engine.run( testDocument );
    expect(results).toHaveProperty('success');
    expect(results.success).toBe(true);
  });
  
  
});