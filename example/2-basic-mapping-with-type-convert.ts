import { convert } from '../lib/converter';

const rules = require('../data/mapping/book-store-to-authors-tc.json');
const bookstore = require('../data/source/book-store.json');

let result = convert(bookstore, rules);

console.log('result = ', JSON.stringify(result, null, '\t'));