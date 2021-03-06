import { Operation } from "./rule-operation.model";

type OperationSequence = Operation[];

export class NativeMappingRule {

  name: string;

  pipelines: OperationSequence[];

  isEntry?: boolean;

}

export type NativeMappingConfig = NativeMappingRule[];
