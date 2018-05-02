import { StringStyledMappingConfig } from '../types/string-styled-mapping-rule.model';
import { naitiveConverter } from './native-converter';
import { parseMappingConfig } from './parser';


export function convert(srcData: any, config: StringStyledMappingConfig): any {
  let nativeConfig = parseMappingConfig(config);
  return naitiveConverter(srcData, nativeConfig);
}
