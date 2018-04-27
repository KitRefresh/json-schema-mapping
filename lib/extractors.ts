const paramPipeSpliter = new RegExp(/^(.+)\((.+)\)$/g);

export function extractParamPipe(pipe: string): { fname: string, fparams: string[] } {
  let results = paramPipeSpliter.exec(pipe);

  // Reset the state of given regex;
  // https://stackoverflow.com/questions/11477415/why-does-javascripts-regex-exec-not-always-return-the-same-value
  paramPipeSpliter.lastIndex = 0;

  if (!results || results.length !== 3) {
    return { fname: '', fparams: [] };
  }

  const [ _, fname, fparam ] = results;
  let params = fparam
    .split(',')
    .filter(x => x)
    .map(x => {
      return removeStringQuota(x.trim());
    });

  return { fname, fparams: params };
}

function removeStringQuota(str: string): string {
  if (!str || str.length < 2) {
    return str;
  }

  let first = str[0];
  let last = str[str.length - 1];

  if (first !== last) {
    return str;
  }

  if (first === '\'' || first === '"' || first === '`') {
    return str.substr(1, str.length - 2);
  }

  return str;
}