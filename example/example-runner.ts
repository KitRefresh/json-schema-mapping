import { Logger, LogSeverity } from "../lib/utils/logger";
import { StringStyledMappingConfig } from "../types/string-styled-mapping-rule.model";
import { convert } from "../lib/converter";

let logger = new Logger('[Example]', LogSeverity.DEBUG);

export function runExample(srcData: any, mappingConfig: StringStyledMappingConfig): void {
  logger.debug('Start execute example...');
  let result = convert(srcData, mappingConfig);
  logger.debug(result);
  logger.debug('Finish execution.')
}