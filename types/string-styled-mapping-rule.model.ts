declare type Rule = string[];

export class StringStyledMappingRule {
  name: string;
  rules: Rule[];
}

export type StringStyledMappingConfig = StringStyledMappingRule[];
