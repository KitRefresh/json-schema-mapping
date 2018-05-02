import { NativeMappingRule } from '../types/native-mapping-rule.model';
import { StringStyledMappingRule, StringStyledMappingConfig } from '../types/string-styled-mapping-rule.model';
import { curry } from '../utils/curry';
import { Logger } from '../utils/logger';
import BuiltInPipes from './builtin-pipes';
import { pipebuilder } from './operation-handler/pipebuilder';
import { pullData } from './operation-handler/pulldata';
import { pushData } from './operation-handler/pushdata';
import { isMultiPuller, isParamPipe, isPusher, isSinglePuller } from './parser/validators';
import { Operation, PullOperation, PushOperation, ProcessOperation } from '../types/rule-operation.model';
import { RuleTypeIndicator } from '../utils/operation-type-indicator';
import { parseMappingConfig } from './parser';

const logger = new Logger('[Converter]', 2);

const FALLBACK_VALUE = null;

export function convert(srcData: any, config: StringStyledMappingConfig): any {
  let nativeConfig = parseMappingConfig(config);
  return naitiveConvert(srcData, nativeConfig);
}

function naitiveConvert(srcData: any, rules: NativeMappingRule[]): any {
  if (!rules || rules.length === 0) {
    logger.warn('Empty rules');
    return FALLBACK_VALUE;
  }

  const entryRules = rules.filter(x => x.isEntry);

  if (entryRules.length !== 1) {
    logger.warn('No entry rule or multiple entry rules.');
    return FALLBACK_VALUE;
  }

  const ruleByName = new Map<string, NativeMappingRule>();
  rules.forEach((rule) => {
    ruleByName.set(rule.name, rule);
  })

  const entryRuleName = entryRules[0].name;
  const result = applyMappingRule(entryRuleName, ruleByName, srcData);

  return result;
}

function applyMappingRule(ruleName: string, relatedRules: Map<string, NativeMappingRule>, srcData: any): any {
  if (!relatedRules.has(ruleName)) {
    logger.warn(`Cannot find given rule: ${ruleName}.`);
    return FALLBACK_VALUE;
  }

  let mappingRule = relatedRules.get(ruleName);
  let result: any;

  for (let pipeline of mappingRule.pipelines) {
    logger.debug('Execute rules: ', pipeline);

    // 1 - Validate: Each rule should at least have two segments: pull + push.
    if (pipeline.length < 2) {
      logger.error('Invalid mapping rule!');
      return FALLBACK_VALUE;
    }

    let streams: any[] = [];
    // 2 - Execute sub rules.
    for (let opt of pipeline) {

      /* Apply operators */

      // PULL
      if (RuleTypeIndicator.isPullOperation(opt)) {
        streams = (opt as PullOperation).sources
          .map((sourcePath) => pullData(srcData, sourcePath));

        logger.debug('$ - Anchor to: ', streams);
      }

      // PUSH
      else if (RuleTypeIndicator.isPushOpertaion(opt)) {
        // If data streams are not merged to one, save them as array.
        let dataToWrite = streams.length > 1 ? streams : streams[0];

        for (let targetPath of (opt as PushOperation).targets) {
          result = pushData(result, targetPath, dataToWrite);
        }

        logger.debug('T - Wrote to: ', result, 'with', dataToWrite);
      }

      // PROCESS
      else if (RuleTypeIndicator.isProcessOperation(opt)) {

        // i - Init 'fn' based on pipeName.
        const { isHyperRule, pipeName, pipeParameters } = (opt as ProcessOperation);
        let fn: Function;

        if (isHyperRule) {

          // DFS to transfrom recursively (ignore parameters).
          fn = curry(applyMappingRule, pipeName, relatedRules);
        }

        else if (pipeName in BuiltInPipes) {

          // Invoke built-in pipes with params.
          fn = pipebuilder(BuiltInPipes[pipeName], ...pipeParameters);
        }

        if (!fn) {
          logger.error('Cannot find given pipe: ', pipeName);
          continue;
        }

        // ii - Init input data source
        let { indexed, selectedIndex } = (opt as ProcessOperation);
        let inputData: any = streams;

        if (indexed) {
          inputData = streams.slice(selectedIndex, selectedIndex + 1);
        }

        // iii - Execute transform process.
        const { iterative } = (opt as ProcessOperation);
        let outputData: any;

        if (iterative) {

          // HACK: iterative mode only transform the first stream. Ignore other streams.
          inputData = inputData[0];

           // Validate selectedData is iterable.
           if (!Array.isArray(inputData)) {
            logger.error('Non-iterable data stream. Please check your rule!', opt);
            continue;
          }

          outputData = (inputData as any[]).map(x => fn(x));

        } else {

          // Expand input data as 1~N parameters.
          outputData = fn(...inputData);
        }

        // iv - Write output result to target.

        if (indexed) {

          // Only modify ith stream under indexed mode.
          streams[selectedIndex] = outputData;
        } else {

          // Otherwise, rewrite whole stream.
          streams = [ outputData ];
        }

        logger.log('F - Transformed data stream: ', streams);
      }
    }
  }

  return result;
}
