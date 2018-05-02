import { Pipe } from '../../types/pipe.model';
import { curry } from '../utils/curry';

// TODO: validate parameter length.
export function pipebuilder(pipe: Pipe, ...givenParams: any[]): (...params: any[]) => any {
  return (...restParams: any[]) => {

    let result: any;

    try {
      result = curry(pipe.exec, ...givenParams)(...restParams);
    } catch(e) {
      result = pipe.err ? pipe.err(e) : null;
    }

    return result;
  }
}