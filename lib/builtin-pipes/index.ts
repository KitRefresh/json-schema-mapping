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

  'country.code_to_name': {
    in: 1,
    out: 1,
    exec: (d: number) => 'China',
    err: (e) => '',
  },

  'array.wrap': {
    in: 1,
    out: 1,
    exec: (d: any) => [d],
  },

  'array.index': {
    in: 2,
    out: 1,
    exec: (index: number, d: any[]) => d[index],
    err: (e) => null,
  },

  'array.merge': {
    in: -1,
    out: 1,
    exec: (inputArrs: any[][]) => {
      return [].concat(...inputArrs);
    },
    err: (e) => []
  },

  'object.get': {
    in: 2,
    out: 1,
    exec: (key: string, d: object) => d[key],
    err: (e) => null,
  }
}

export default BuiltInPipes;