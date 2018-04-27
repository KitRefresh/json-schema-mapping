import * as jsonpath from 'jsonpath';

/**
 * Select a bunch of data from source by following JSON path.
 * @param {any} source - Data source to select a bunch of data.
 * @param {string} path - JSON path to define how to select data.
 * @returns {any} - Selected data.
 */
export function pullData(source: any, path: string): any {
  // TODO: make the result symmentric
  let data = jsonpath.query(source, path);
  if (path.endsWith(']')) {
    return data;
  }
  return data[0];
}

