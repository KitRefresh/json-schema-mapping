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
    exec: (wrapper: string, d: string) => wrapper + d + wrapper,
  },

  'math.round': {
    in: 1,
    out: 1,
    exec: (d: number) => Math.round(d),
    err: (e) => NaN,
  },

}

export default BuiltInPipes;