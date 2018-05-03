import { runExample } from './example-runner';
import { convert } from '../lib/converter';

const rules = require('./data/mapping/number-to-string.rule.json');
const numberstore = require('./data/source/number-store.json');

runExample(numberstore, rules);
