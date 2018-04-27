export function curry(fn: Function, ...bindArgs) {
  return (...restArgs) => fn(...bindArgs, ...restArgs);
}

export function rcurry(fn: Function, ...rBindArgs) {
  return (...restArgs) => fn(...restArgs, ...rBindArgs);
}