import { StringStyledMappingRule } from '../types/string-styled-mapping-rule.model';
import { curry } from '../utils/curry';
import { Logger } from '../utils/logger';
import BuiltInPipes from './builtin-pipes';
import { extractParamPipe } from './extractors';
import { pipebuilder } from './operation-handler/pipebuilder';
import { pullData } from './operation-handler/pulldata';
import { pushData } from './operation-handler/pushdata';
import { isMultiPuller, isParamPipe, isPusher, isSinglePuller } from './parser/validators';

const logger = new Logger('[Converter]', 2);

const ENTRY_RULE_NAME = '__root__';
const FALLBACK_VALUE = null;


export function convert(source: any, rules: StringStyledMappingRule[]): any {
  if (!rules || rules.length === 0) {
    logger.warn('Empty rules');
    return FALLBACK_VALUE;
  }

  const entryRules = rules.filter(x => x.name === ENTRY_RULE_NAME);
  
  if (entryRules.length !== 1) {
    logger.warn('No __root__ rule or multiple __root__ rules.');
    return FALLBACK_VALUE;
  }

  const ruleByName = new Map<string, StringStyledMappingRule>();
  rules.forEach((rule) => {
    ruleByName.set(rule.name, rule);
  })

  const result = applyMappingRule(ENTRY_RULE_NAME, ruleByName, source);

  return result;
}

function applyMappingRule(ruleName: string, relatedRules: Map<string, StringStyledMappingRule>, source: any): any {
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

    let selectedData: any[] = [];
    // 2 - Execute sub rules.
    for (let opt of rule) {

      /* Apply operators */

      // Pull
      if (isSinglePuller(opt)) {
        selectedData = [ pullData(source, opt) ];

        logger.debug('$ - Anchor to: ', selectedData);
      }

      else if (isMultiPuller(opt)) {
        let pullers = opt.split(',').filter(x => x).map(x => x.trim());
        selectedData = pullers.map(puller => pullData(source, puller));

        logger.debug('$ - Anchor to list: ', selectedData);
      }

      // Push
      else if (isPusher(opt)) {
        logger.debug('T - Write to: ', result, 'with', selectedData[0]);

        result = pushData(result, opt, selectedData[0]);
      }

      // Transform -> recursively
      else if (opt.startsWith('@')) {
        selectedData[0] = applyMappingRule(opt.slice(1), relatedRules, selectedData[0]);
      }




      // TODO: merge all case together. Make it more reusable.

      // Iterate condition
      else if (opt.startsWith('~')) {

        // Validate selectedData is iterable.
        if (!Array.isArray(selectedData[0])) {
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

        selectedData[0] = (selectedData[0] as any[]).map(fn); 
        logger.debug('~$ - Batch anchor to: ', selectedData);
      }

      // Built-in function
      else if (opt in BuiltInPipes){

        selectedData[0] = pipebuilder(BuiltInPipes[opt])(selectedData[0]);

      }

      // pipes with params
      else if (isParamPipe(opt)) {
        const pipeInsight = extractParamPipe(opt);

        const { fname, fparams } = pipeInsight;

        if (!fname) {
          logger.warn('Invalid pipe, extract info failed.', opt);
          continue;
        }

        if (!(fname in BuiltInPipes)) {
          logger.warn('Cannot find pipe definition: ', opt);
          continue;
        }

        selectedData[0] = pipebuilder(BuiltInPipes[fname], ...fparams)(...selectedData);
      }

      // Visit and transform nth data. (#0:pipeName is the default case. #0:could be omitted.)
      else if (opt.startsWith('#')) {
        const regex = new RegExp(/\#([0-9]+)\:(.+)/g);
        const result = regex.exec(opt);

        if (!result || result.length !== 3) {
          logger.warn('Cannot understand pipe: ', opt);
          continue;
        }

        const [ _, indexStr, realOpt ] = result;
        const index = parseInt(indexStr);

        if (!Number.isInteger(index)) {
          logger.warn('#', 'Invalid indexStr: ', indexStr);
          continue;
        }

        if (!selectedData[index]) {
          logger.warn('#', 'Invalid index at: ', index, '(no data).');
          continue;
        }

        if (!(realOpt in BuiltInPipes)) {
          logger.warn('#', 'Cannot find rest part in pipe: ', realOpt);
          continue;
        }

        selectedData[index] = pipebuilder(BuiltInPipes[realOpt])(selectedData[index]);
      }
      
      // Unhandled cases. Skip it.
      else {
        logger.warn(`Unknown pipe: ${opt}`);
        continue;
      }
    }

  }
  
  return result;
}
