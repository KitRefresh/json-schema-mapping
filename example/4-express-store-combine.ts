import { convert } from '../lib/converter';

const rules = require('../data/mapping/express-store-address-merge.json');
const express_store = require('../data/source/express-store.json');

console.log('data loaded');
let result = convert(express_store, rules);

console.log('Result: ', JSON.stringify(result, null, '\t'));