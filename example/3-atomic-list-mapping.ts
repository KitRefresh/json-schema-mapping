import { convert } from '../lib/converter';

const rules = require('../data/mapping/number-to-string.json');
const numberstore = require('../data/source/number-store.json');

let result = convert(numberstore, rules);

console.log('Result: ', JSON.stringify(result));