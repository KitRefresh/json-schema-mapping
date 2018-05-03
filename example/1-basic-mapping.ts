import { runExample } from './example-runner';
import { convert } from '../lib/converter';

const rules = require('./data/mapping/book-store-to-authors.rule.json');
const bookstore = require('./data/source/book-store.json');

runExample(bookstore, rules);