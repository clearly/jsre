const { Engine } = require('../lib');
const _ = require('lodash');

/* global expect */

const rulesTemplate = [
  {
    conditions: {
      all: [
        {
          any : [
            {
              lhs: {
                path: "prop1"
              },
              rhs: {
                path: "prop2"
              }
            },
            {
              operator: "lessThan",
              lhs: {
                path: "prop2"
              },
              rhs: 10
            }
          ]
        }
      ]
    }
  }
];

const errors = [
  {
    keyword: 'required',
    dataPath: '[0].conditions',
    schemaPath: '#/required',
    params: { missingProperty: 'operator' },
    message: "should have required property 'operator'"
  },
  {
    keyword: 'required',
    dataPath: '[0].conditions.all[0]',
    schemaPath: '#/required',
    params: { missingProperty: 'operator' },
    message: "should have required property 'operator'"
  },
  {
    keyword: 'required',
    dataPath: '[0].conditions.all[0]',
    schemaPath: '#/oneOf/1/required',
    params: { missingProperty: 'all' },
    message: "should have required property 'all'"
  },
  {
    keyword: 'required',
    dataPath: '[0].conditions.all[0].any[0]',
    schemaPath: '#/required',
    params: { missingProperty: 'operator' },
    message: "should have required property 'operator'"
  },
  {
    keyword: 'required',
    dataPath: '[0].conditions.all[0].any[0]',
    schemaPath: '#/oneOf/1/required',
    params: { missingProperty: 'all' },
    message: "should have required property 'all'"
  },
  {
    keyword: 'required',
    dataPath: '[0].conditions.all[0].any[0]',
    schemaPath: '#/oneOf/2/required',
    params: { missingProperty: 'any' },
    message: "should have required property 'any'"
  },
  {
    keyword: 'oneOf',
    dataPath: '[0].conditions.all[0].any[0]',
    schemaPath: '#/oneOf',
    params: { passingSchemas: null },
    message: 'should match exactly one schema in oneOf'
  },
  {
    keyword: 'oneOf',
    dataPath: '[0].conditions.all[0]',
    schemaPath: '#/oneOf',
    params: { passingSchemas: null },
    message: 'should match exactly one schema in oneOf'
  },
  {
    keyword: 'required',
    dataPath: '[0].conditions',
    schemaPath: '#/oneOf/2/required',
    params: { missingProperty: 'any' },
    message: "should have required property 'any'"
  },
  {
    keyword: 'oneOf',
    dataPath: '[0].conditions',
    schemaPath: '#/oneOf',
    params: { passingSchemas: null },
    message: 'should match exactly one schema in oneOf'
  }
];


describe( 'Schema tests', () => {
  test('missing operator fail', () => {
    expect.assertions(2);
    try {
      new Engine( { rules : rulesTemplate } );
    } catch (error) {
      expect(error.length).toBe(10);
      expect(error).toMatchObject(errors);
    }    
  });
  test('load yaml file pass', () => {
    const testDocument = { prop1 : 1, prop2 : 4 };
    const engine = new Engine( { yamlFile: __dirname + '/data/sampleRules.yaml' } );
    const results = engine.run( testDocument );
    expect(results).toHaveProperty('success');
    expect(results.success).toBe(true);
  });

  test('mis-spelled operator', () => {
    const testDocument = { prop1 : 1, prop2 : 4 };
    const rules = _.cloneDeep( rulesTemplate );
    rules[0].conditions.all[0].any[0].operator = 'FatFinger';
    const engine = new Engine( { rules } );
    const results = engine.run( testDocument );
    
    // console.log( JSON.stringify( results, null, 2 ) );
    
    expect(results).toHaveProperty('success');
    expect(results.success).toBe(true);
    expect(results.rules[0].conditions.all[0].any[0]).toHaveProperty('error');
    expect(typeof results.rules[0].conditions.all[0].any[0].error).toBe('object');
    expect(results.rules[0].conditions.all[0].any[0].error.unknownOperator).toBe(true);
  });

});

