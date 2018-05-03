import { runExample } from '../example-runner';

const rules = require('./data/mapping/express-store-address-merge.rule.json');
const express_store = require('./data/source/express-store.json');

runExample(express_store, rules);
