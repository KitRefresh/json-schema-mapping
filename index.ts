import { isSinglePuller } from './lib/rulevalidator';

let validate = [
  ['$', true],
  ['$.', true],
  ['$.a.b.c', true],
  ['$.a[]', false],
  ['$.a[*]', true],
  ['$.a[1:3]', true],
  ['$.a[]']
];

