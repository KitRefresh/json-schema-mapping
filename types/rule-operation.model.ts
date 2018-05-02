/**
 * Operation types enumeration.
 * A complete MappingRule should contain 3 steps:
 *  1. pull data from source.
 *  2. apply data transform function.
 *  3. push data to target.
 * 
 * e.g.
 *    let userName = src.query('$.name');     // pull
 *    userName = userName.toUpperCase();      // process
 *    target['name'] = userName;              // push
 */
export enum OperationType {

  /** Retrieve selected data from source. */
  PULL = 'pull',

  /** Transform data thorough pipes. */
  PROCESS = 'process',

  /** Write data to target json. */
  PUSH = 'push',
};


/**
 * Base type for all *Operation types.
 */
export class Operation {
  readonly type: OperationType;
}


/**
 * Type definition for 'PULL' operations.
 * 
 * e.g. If you want to select the 'name' field from source data, the PullOperation should be:
 *    operation = {
 *      type: PULL,
 *      path: '$.name',
 *      autoextract: true
 *    }
 */
export class PullOperation extends Operation {

  readonly type: OperationType = OperationType.PULL;

  /** JSONPath string indicates which part of data shoud be selecetd. */
  path: string;

  /**
   * Set 'autoextract' = 'true' to auto extract selected data from the result of JSONPath.query.
   * 
   * The result of JSONPath.query will always be an array even you only select one field.
   *    e.g. JSONPath.query(userData, '$.name') -> ['James']
   * To get rid of the extra [] wrapper when necessary, set 'autowrap' = true.
   * (https://github.com/dchester/jsonpath)
  */
  autowrap: boolean;
}


/**
 * Type definition for 'PROCESS' operations.
 * 
 * e.g. If you want to split input data by '.', you need to invoke pipe 'string.split'
 *      and set the separator to '.'. Your ProcessOperation should look like this:
 *      
 *      operation = {
 *        type: PROCESS,
 *        pipe: 'string.split',
 *        params: ['.']
 *      }
 *      
 *      where 'string.split' is a built-in function like this:
 *      - string.split = (separator: string, input: string) => input.split(separator);
 *      
 *      Those preset parameters in 'params' will be used to curry the pipe function:
 *      - fn = curry(string.split, '.')
 *      where `fn` is a function only accept one string 'input' and return string[].
 * 
 */
export class ProcessOperation extends Operation {

  readonly type: OperationType = OperationType.PROCESS;

  /**
   * The name of selected pipe.
   * (Could be a built-in pipe or a customized pipe.)
  */
  pipe: string;

  /**
   * Preset parameters of pipe function.
   */
  params: any[];

  /**
   * Indicator of how to process input data.
   * 
   * - If 'true', perform like y = x.map(xi => fn(xi));
   * - If 'false', perform like y = fn(x).
   */
  iterative: boolean;

  /**
   * Indicates if this opt is a reference of another mapping rule.
   * 
   * - If 'true', the executor will perform mapping recursively.
   * - If 'false', search the handler among all built-in pipes.
   */
  isHyperRule: boolean;
}


/**
 * Type definition for 'PUSH' operations.
 * 
 * e.g.1
 *      If you want to write data (a string) to `result.name`, your operation should like this:
 * 
 *      operation = {
 *        type: 'PUSH',
 *        target: 'T.name',
 *        iterative: false,
 *      }
 * 
 * e.g.2
 *      If you want to write a series of data (a string list) to `result[i].name`,
 *      your operation should look like this:
 * 
 *      operation = {
 *        type: 'PUSH',
 *        target: 'T.name',
 *        iterative: true,
 *      }
 *      
 *      Assuming the input is ['John', 'James'], the result should be
 *      - [ { name: 'John' }, { name: 'James' } ].
 *      Compared with the condition when 'iterative' = false, the result would be
 *      - { name: [ 'John', 'James' ] }.
 */
export class PushOperation extends Operation {

  readonly type: OperationType = OperationType.PUSH;

  /** Target path in string indicates where to write the data. */
  target: string;

  /**
   *  Indicator of how to handle input data.
   * 
   *  If true, iterate input data and create an output for each item. Then wrap those outputs
   *  into an array. (If input data is not iterable, ignore it.)
   * 
   *  (Actually, the responsibility of 'iterative' here is overlapped with that in ProcessOperation.
   *  As a replacement, you can define a recursive mapping rule to perform the iterative PushOperation.
   *  But it's insaine to have one recursive mapping for each array PushOperation. For now, just keep it.)
   */
  iterative: boolean;
}