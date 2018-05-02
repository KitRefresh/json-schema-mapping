import { NativeMappingRule, NativeMappingConfig } from '../../types/native-mapping-rule.model';
import { Operation, ProcessOperation, PullOperation, PushOperation } from '../../types/rule-operation.model';
import { StringStyledMappingRule, StringStyledMappingConfig } from '../../types/string-styled-mapping-rule.model';
import { isMultiPuller, isPusher, isSinglePuller, isPuller } from './validators';
import { buildPullOpt, buildPushOpt, buildProcessOpt } from './opt-parsers';

const ENTRY_RULE_NAME = '__root__';

export function parseMappingConfig(input: StringStyledMappingConfig): NativeMappingConfig {
  return input.map(parseMappingRule);
}

export function parseMappingRule(input: StringStyledMappingRule): NativeMappingRule {
  return {
    name: input.name,
    pipelines: input.rules.map(rule => {
      return rule.map(singleRuleStr => stringToOperation(singleRuleStr));
    }),
    isEntry: input.name === ENTRY_RULE_NAME,
  };
}

function stringToOperation(str: string): Operation {
  let opt: Operation;

  if (isPuller(str)) {
    opt = buildPullOpt(str);
  }

  else if (isPusher(str)) {
    opt = buildPushOpt(str);
  }

  else {
    opt = buildProcessOpt(str);
  }

  return opt;
}