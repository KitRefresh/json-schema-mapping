import { MappingRule } from "../types/mapping-rule.model";
import * as jsonpath from 'jsonpath';
import { Logger } from "../utils/logger";
import BuiltInPipes from "./builtin-pipes";

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

  const rootRule = entryRules[0];
  const result = applyMappingRule(source, ENTRY_RULE_NAME, ruleByName);

  return result;
}

function applyMappingRule(source: any, ruleName: string, relatedRules: Map<string, MappingRule>): any {
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

      // Iterate
      else if (opt.startsWith('~@')) {
        if (!Array.isArray(selectedData)) {
          logger.error('Non-iterable data stream. Please check your rule!');
          return FALLBACK_VALUE;
        }


        selectedData = (selectedData as any[]).map(data => {
          return applyMappingRule(data, opt.slice(2), relatedRules);
        })

        logger.debug('~$ - Batch anchor to: ', selectedData);
      }

      // Transform recursively
      else if (opt.startsWith('@')) {
        selectedData = applyMappingRule(selectedData, opt.slice(1), relatedRules);
      }

      // Built-in function
      else if (opt in BuiltInPipes){
        const builtInPipe = BuiltInPipes[opt];

        try {
          selectedData = builtInPipe.exec(selectedData);
        } catch(e) {
          selectedData = builtInPipe.err(e);
        }
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

function pullData(source: any, path: string) {
  // TODO: make the result symmentric
  let data = jsonpath.query(source, path);
  if (path.endsWith(']')) {
    return data;
  }
  return data[0];
}


function pushData(target: any, path: string, data: any): any {
  let fields = path.split('.').slice(1);

  // path === 'T'
  if (fields.length === 0) {
    return data;
  }

  let result: object = target || {};

  // Skip the last element
  result = fields.reduce(
    (acc, curr, index) => {
      if (index === fields.length - 1) {

        // last element, write value.
        acc[curr] = data;
        return result;

      } else {

        // not last element, descent.
        if (!(curr in acc)) {
          acc[curr] = {}
        }

        return acc[curr];

      }
    },
    result
  );

  return result;
}

