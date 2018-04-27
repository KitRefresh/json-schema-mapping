import { Pipe } from '../types/pipe.model';
import BuiltInPipes from './builtin-pipes';

export function pipebuilder(pipe: Pipe): (data: any) => any {
  return (data: any) => {

    let result: any;

    try {
      result = pipe.exec(data);
    } catch(e) {
      result = pipe.err ? pipe.err(e) : null;
    }

    return result;
  }
}