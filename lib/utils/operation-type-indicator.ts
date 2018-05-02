import { Operation, OperationType } from '../../types/rule-operation.model';

/**
 * Class used to judge an Operation's type.
 * 
 * Since type system in weakly typed language is not reliable (typescript here),
 * judge the type by comparing the 'type' field as a replacement.
 * (For those strongly typed language like C++, replace this module with more robust solution. )
 */
export class OperationTypeIndicator {

  /**
   * Judge the given operation is a PULL operation.
   * @param {Operation} opt Input operation.
   * @return {boolean} If input is PullOperation, return true.
   */
  static isPullOperation(opt: Operation): boolean {
    return opt.type === OperationType.PULL;
  }

  /**
   * Judge the given operation is a PROCESS operation.
   * @param {Operation} opt Input operation.
   * @return {boolean} If input is ProcessOperation, return true.
   */
  static isProcessOperation(opt: Operation): boolean {
    return opt.type === OperationType.PROCESS;
  }

  /**
   * Judge the given operation is a PUSH operation.
   * @param {Operation} opt Input operation.
   * @return {boolean} If input is PushOperation, return true.
   */
  static isPushOpertaion(opt: Operation): boolean {
    return opt.type === OperationType.PUSH;
  }
  
  /**
   * Infer the input Operation's type direcly.
   * @param {Operation} opt Input operation.
   * @return {OperationType} Exact type of given input.
   */
  static inferOperationType(opt: Operation): OperationType {
    return opt.type;
  }
}