import { PullOperation, ProcessOperation, PushOperation } from "../../types/rule-operation.model";

// TODO: finish exact parsing logic.

export function buildPullOpt(str: string): PullOperation {
  return new PullOperation();
}

export function buildProcessOpt(str: string): ProcessOperation {
  return new ProcessOperation();
}

export function buildPushOpt(str: string): PushOperation {
  return new PushOperation();
}