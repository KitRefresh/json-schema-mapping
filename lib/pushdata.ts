/**
 * Inject data into existing target under the instruction of
 * given JSON path. If target not exist, create one.
 * 
 * @param {Object} target - The target object to write data.
 * @param {string} path - The path to define where should data go.
 * @param {any} data - Data to be injected.
 * @returns {Object} - Modified 'target' with 'data' injected at 'path'.
 */
export function pushData(target: any, path: string, data: any): any {
  let fields = path.split('.').slice(1);

  // path === 'T'
  if (fields.length === 0) {
    return data;
  }

  let result: object = target || {};

  // Skip the last element
  result = fields.reduce(
    (acc, curr, index) => {
      if (index === fields.length - 1) {

        // last element, write value.
        acc[curr] = data;
        return result;

      } else {

        // not last element, descent.
        if (!(curr in acc)) {
          acc[curr] = {}
        }

        return acc[curr];

      }
    },
    result
  );

  return result;
}

