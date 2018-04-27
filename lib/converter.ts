import { MappingRule } from '../types/mapping-rule.model';
import { curry } from '../utils/curry';
import { Logger } from '../utils/logger';
import BuiltInPipes from './builtin-pipes';
import { pipebuilder } from './pipebuilder';
import { pullData } from './pulldata';
import { pushData } from './pushdata';

const logger = new Logger('[Converter]', 3);

const ENTRY_RULE_NAME = '__root__';
const FALLBACK_VALUE = null;

export function convert(source: any, rules: MappingRule[]): any {
  if (!rules || rules.length === 0) {
    logger.warn('Empty rules');
    return FALLBACK_VALUE;
  }

  const entryRules = rules.filter(x => x.name === ENTRY_RULE_NAME);
  
  if (entryRules.length !== 1) {
    logger.warn('No __root__ rule or multiple __root__ rules.');
    return FALLBACK_VALUE;
  }

  const ruleByName = new Map<string, MappingRule>();
  rules.forEach((rule) => {
    ruleByName.set(rule.name, rule);
  })

  const result = applyMappingRule(ENTRY_RULE_NAME, ruleByName, source);

  return result;
}

function applyMappingRule(ruleName: string, relatedRules: Map<string, MappingRule>, source: any): any {
  if (!relatedRules.has(ruleName)) {
    logger.warn(`Cannot find given rule: ${ruleName}.`);
    return FALLBACK_VALUE;
  }

  let mappingRule = relatedRules.get(ruleName);
  let result: any;

  for (let rule of mappingRule.rules) {
    logger.debug('Execute rules: ', rule);
    // 1 - Validate: Each rule should at least have two segments: pull + push.
    if (rule.length < 2) {
      logger.error('Invalid mapping rule!');
      return FALLBACK_VALUE;
    }

    let selectedData: any;
    // 2 - Execute sub rules.
    for (let opt of rule) {

      /* Apply operators */

      // Pull
      if (opt.startsWith('$')) {
        selectedData = pullData(source, opt);

        logger.debug('$ - Anchor to: ', selectedData);
      }

      // Push
      else if (opt.startsWith('T')) {
        logger.debug('T - Write to: ', result, 'with', selectedData);

        result = pushData(result, opt, selectedData);
      }

      // Transform -> recursively
      else if (opt.startsWith('@')) {
        selectedData = applyMappingRule(opt.slice(1), relatedRules, selectedData);
      }

      // Iterate condition
      else if (opt.startsWith('~')) {

        // Validate selectedData is iterable.
        if (!Array.isArray(selectedData)) {
          logger.error('Non-iterable data stream. Please check your rule!');
          return FALLBACK_VALUE;
        }

        let fn: (data: any) => any;

        // Recursive mapping rule.
        if (opt.startsWith('~@')) {

          const subRule = opt.slice(2);
          fn = curry(applyMappingRule, subRule, relatedRules);

        } else if (opt.slice(1) in BuiltInPipes) {

          const selectedPipe = BuiltInPipes[opt.slice(1)];
          fn = pipebuilder(selectedPipe);

        }

        if (!fn) {
          logger.warn('Cannot find mapping rule.');
          return FALLBACK_VALUE;
        }

        selectedData = (selectedData as any[]).map(fn); 
        logger.debug('~$ - Batch anchor to: ', selectedData);
      }

      // Built-in function
      else if (opt in BuiltInPipes){

        selectedData = pipebuilder(BuiltInPipes[opt])(selectedData);

      }
      
      // Unhandled cases. Skip it.
      else {
        logger.warn(`Unknown pipe: ${rule}`);
        continue;
      }
    }

  }
  
  return result;
}
