import { runExample } from '../example-runner';

const rules = require('./data/mapping/book-store-to-authors-tc.rule.json');
const bookstore = require('./data/source/book-store.json');

runExample(bookstore, rules);
