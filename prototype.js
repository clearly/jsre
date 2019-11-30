const _ = require('lodash');
const fs = require('fs');

const path = "Document.FIToFICstmrCdtTrf.GrpHdr.NbOfTxs._text";
const doc = JSON.parse( fs.readFileSync( './test/data/test-document-1.json', 'utf8' ) );

function main() {
  console.log( JSON.stringify( doc, null, 2 ) );
  const result = _.get( doc, path );
  console.log( { result } );
}

main();