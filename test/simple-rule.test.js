const { Engine } = require('../lib');
const fs = require('fs');

/* global expect */

test('simple rule pass', () => {
  const testDocument = JSON.parse( fs.readFileSync( __dirname + '/data/test-document-1.json' ) );
  const engine = new Engine( { yamlFile : __dirname + '/simple-rule.yaml' } );
  const results = engine.run( testDocument );
  expect(results).toHaveProperty('success');
  expect(results.success).toBe(true);
});


test('simple rule fail', () => {
  const testDocument = JSON.parse( fs.readFileSync( __dirname + '/data/test-document-1.json' ) );
  testDocument.Document.FIToFICstmrCdtTrf.GrpHdr.NbOfTxs._text = 2;
  const engine = new Engine( { yamlFile : __dirname + '/simple-rule.yaml' } );
  const results = engine.run( testDocument );
  expect(results).toHaveProperty('success');
  expect(results.success).toBe(false);
  expect(results).toHaveProperty('errors');
  expect(results.errors.length).toBe(1);
});