import { ProcessOperation, PullOperation, PushOperation } from '../../types/rule-operation.model';
import { extractParamPipe } from './extractors';
import { isMultiPuller, isParamPipe, isSinglePuller, isIterativePusher } from './validators';

// TODO: use real parsers instead of regex.

export function buildPullOpt(str: string): PullOperation {
  let opt = new PullOperation();

  if (isSinglePuller(str)) {
    opt.sources = [str];
  } else if (isMultiPuller(str)) {
    opt.sources = str.split(',').filter(x => x).map(x => x.trim());
  }

  return opt;
}

export function buildProcessOpt(str: string): ProcessOperation {
  let opt = new ProcessOperation();
  let stream = str;
  
  if (stream.startsWith('#')) {
    const regex = new RegExp(/\#([0-9]+)\:(.+)/g);  // e.g. #1:pipe(1,2,3)
    const result = regex.exec(stream);

    if (result && result.length === 3) {
      const [_, indexStr, restStr] = result;
      const index = parseInt(indexStr);

      if (!Number.isInteger(index)) {
        throw new Error(`Invalid indexStr: ${indexStr} in pipe string.`);
      }

      opt.sliced = true;
      opt.selectedIndex = index;
      stream = restStr;
    } else {
      throw new Error(`Invalid pipe with sliced opt: ${str}`);
    }
  }

  if (stream.startsWith('~')) {
    opt.iterative = true;
    stream = stream.slice(1);
  }

  if (stream.startsWith('@')) {
    opt.isHyperRule = true;
    stream = stream.slice(1);
  }


  if (isParamPipe(stream)) {

    const { fname, fparams } = extractParamPipe(stream);
    opt.pipeName = fname;
    opt.pipeParameters = fparams;
  } else {

    opt.pipeName = stream;
  }

  return opt;
}

export function buildPushOpt(str: string): PushOperation {
  let opt = new PushOperation(str);

  if (isIterativePusher(str)) {
    const regex = new RegExp(/^(.+)~(.+)$/g);
    const result = regex.exec(str);
    
    if (result && result.length === 3) {
      const [_, path, itKey] = result;
      opt.target = path;
      opt.iterative = true;
      opt.iterateKey = itKey;
    }
  }

  return opt;
}