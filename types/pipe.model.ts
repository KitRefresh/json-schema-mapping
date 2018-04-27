export class Pipe {
  /**
   * How many input parameters.
   */
  in: number;

  /**
   * How many output parameters.
   */
  out: number;

  /**
   * Function defines the execution.
   */
  exec: Function;

  /**
   * Function defines the error handling behavior.
   */
  err?: Function;
}