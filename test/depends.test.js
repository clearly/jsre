const { Engine } = require('../lib');

/* global expect */

const rulesTemplate = [
  {
    conditions: {
      all: [
        {
          id: "id1",
          operator: "equal",
          lhs: 1,
          rhs: {
            path: "prop1.prop2"
          }
        },
        {
          id: "id2",
          depends: "id1",
          operator: "equal",
          lhs: 2,
          rhs: {
            path: "prop1.prop3"
          }
        }
      ]
    }
  }
];

test('schema id and depends properties pass', () => {
  const testDocument = { prop1 : { prop2 : 1, prop3: 2 } };
  const rules = JSON.parse( JSON.stringify( rulesTemplate ) );
  const engine = new Engine( { rules } );
  const results = engine.run( testDocument );
  expect( results ).toHaveProperty( 'success' );
  expect( results.success ).toBe( true );
});

test('parent fail, child success', () => {
  const testDocument = { prop1 : { prop2 : 2, prop3: 2 } };
  const rules = JSON.parse( JSON.stringify( rulesTemplate ) );
  const engine = new Engine( { rules } );
  const results = engine.run( testDocument );
  expect( results ).toHaveProperty( 'success' );
  expect( results.success ).toBe( false );
  expect( results.failures[ 0 ].id ).toBe( "id1" );
  expect( results.failures[ 1 ].id ).toBe( "id2" );
  expect( results.failures[ 1 ] ).toHaveProperty( 'error' );
  expect( results.failures[ 1 ].error ).toHaveProperty( 'unmetDependency' );
  expect( results.failures[ 1 ].error.unmetDependency ).toBe( true );
});

test('parent success, child fail', () => {
  const testDocument = { prop1 : { prop2 : 1, prop3: 1 } };
  const rules = JSON.parse( JSON.stringify( rulesTemplate ) );
  const engine = new Engine( { rules } );
  const results = engine.run( testDocument );
  expect( results ).toHaveProperty( 'success' );
  expect( results.success ).toBe( false );
  expect( results.passes[ 0 ].id ).toBe( "id1" );
  expect( results.failures[ 0 ].id ).toBe( "id2" );
});

test('parent success, child success', () => {
  const testDocument = { prop1 : { prop2 : 1, prop3: 2 } };
  const rules = JSON.parse( JSON.stringify( rulesTemplate ) );
  const engine = new Engine( { rules } );
  const results = engine.run( testDocument );
  expect( results ).toHaveProperty( 'success' );
  expect( results.success ).toBe( true );
  expect( results.passes[ 0 ].id ).toBe( "id1" );
  expect( results.passes[ 1 ].id ).toBe( "id2" );
});

test('multiple dependencies, all success', () => {
  const testDocument = { prop1 : { prop2 : 1, prop3: 2, prop4: 4 } };
  const rules = JSON.parse( JSON.stringify( rulesTemplate ) );
  rules[ 0 ].conditions.all.push({
    id: "id3",
    depends: [ "id1", "id2" ],
    operator: "equal",
    lhs: 4,
    rhs: {
      path: "prop1.prop4"
    }
  });
  const engine = new Engine( { rules } );
  const results = engine.run( testDocument );
  expect( results ).toHaveProperty( 'success' );
  expect( results.success ).toBe( true );
  expect( results.passes[ 0 ].id ).toBe( "id1" );
  expect( results.passes[ 1 ].id ).toBe( "id2" );
  expect( results.passes[ 2 ].id ).toBe( "id3" );
});

test('multiple dependencies, 1 fail, 1 success', () => {
  const testDocument = { prop1 : { prop2 : 1, prop3: 1, prop4: 4 } };
  const rules = JSON.parse( JSON.stringify( rulesTemplate ) );
  rules[ 0 ].conditions.all.push({
    id: "id3",
    depends: [ "id1", "id2" ],
    operator: "equal",
    lhs: 4,
    rhs: {
      path: "prop1.prop4"
    }
  });
  const engine = new Engine( { rules } );
  const results = engine.run( testDocument );
  expect( results ).toHaveProperty( 'success' );
  expect( results.success ).toBe( false );
  expect( results.passes[ 0 ].id ).toBe( "id1" );
  expect( results.failures[ 0 ].id ).toBe( "id2" );
  expect( results.failures[ 1 ].id ).toBe( "id3" );
  expect( results.failures[ 1 ] ).toHaveProperty( 'error' );
  expect( results.failures[ 1 ].error ).toHaveProperty( 'unmetDependency' );
  expect( results.failures[ 1 ].error.unmetDependency ).toBe( true );
  expect( results.failures[ 1 ].error ).toHaveProperty( 'unmetList' );
  expect( results.failures[ 1 ].error.unmetList ).toEqual( expect.arrayContaining( [ "id2" ] ) );
});

test('multiple dependencies, 2 (all) fail', () => {
  const testDocument = { prop1 : { prop2 : 5, prop3: 5, prop4: 4 } };
  const rules = JSON.parse( JSON.stringify( rulesTemplate ) );
  rules[ 0 ].conditions.all.push({
    id: "id3",
    depends: [ "id1", "id2" ],
    operator: "equal",
    lhs: 4,
    rhs: {
      path: "prop1.prop4"
    }
  });
  const engine = new Engine( { rules } );
  const results = engine.run( testDocument );
  expect( results ).toHaveProperty( 'success' );
  expect( results.success ).toBe( false );
  expect( results.failures[ 0 ].id ).toBe( "id1" );
  expect( results.failures[ 1 ].id ).toBe( "id2" );
  expect( results.failures[ 2 ].id ).toBe( "id3" );
  expect( results.failures[ 2 ] ).toHaveProperty( 'error' );
  expect( results.failures[ 2 ].error ).toHaveProperty( 'unmetDependency' );
  expect( results.failures[ 2 ].error.unmetDependency ).toBe( true );
  expect( results.failures[ 2 ].error ).toHaveProperty( 'unmetList' );
  expect( results.failures[ 2 ].error.unmetList ).toEqual( expect.arrayContaining( [ "id1", "id2" ] ) );
});
