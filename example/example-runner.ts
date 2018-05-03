import { Logger, LogSeverity } from "../lib/utils/logger";
import { StringStyledMappingConfig } from "../types/string-styled-mapping-rule.model";
import { convert } from "../lib/converter";

let logger = new Logger('[Example]', LogSeverity.DEBUG);

export function runExample(srcData: any, mappingConfig: StringStyledMappingConfig): void {
  let result = convert(srcData, mappingConfig);
  logger.debug('\n', JSON.stringify(result, null, '\t'), '\n');
}