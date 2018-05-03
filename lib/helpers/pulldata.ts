import * as jsonpath from 'jsonpath';

/**
 * Select a bunch of data from source by following JSON path.
 * @param {any} source - Data source to select a bunch of data.
 * @param {string} path - JSON path to define how to select data.
 * @returns {any} - Selected data.
 */
export function pullData(source: any, path: string): any {
  // HACK: return source data directly if path === '$'
  if (path === '$') {
    return source;
  }

  // TODO: make the result symmentric
  let data = jsonpath.query(source, path);

  // HACK: paths like '$.arr[0]' will auto remove the array wrapper.
  if (path.endsWith(']') && !/\[[0-9]+\]$/.test(path)) {
    return data;
  }
  return data[0];
}

