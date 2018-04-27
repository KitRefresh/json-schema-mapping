const BuiltInPipes = {

  'string.uppercase': {
    in: 1,
    out: 1,
    exec: (d: string) => d.toUpperCase(),
    err: (e) => '',
  },

  'string.lowercase': {
    in: 1,
    out: 1,
    exec: (d: string) => d.toLowerCase(),
    err: (e) => '',
  },

  'string.wrap': {
    in: 2,
    out: 1,
    exec: (wrapper: string, d: string) => `${wrapper}${d}${wrapper}`,
  },

  'string.itoa': {
    in: 1,
    out: 1,
    exec: (d: number) => d.toString(),
    err: (e) => '',
  },

  'string.template': {
    in: -1,
    out: 1,
    exec: (template: string, ...params): string => {
      console.log('string.template', params);
      return template.replace(/\{(\d+)\}/g, (curlyBracket) => {
        const indexStr = curlyBracket.substr(1, curlyBracket.length - 2);
        const index = parseInt(indexStr);
        return `${params[index]}`;
      });
    }
  },

  'math.round': {
    in: 1,
    out: 1,
    exec: (d: number) => Math.round(d),
    err: (e) => NaN,
  },

}

export default BuiltInPipes;