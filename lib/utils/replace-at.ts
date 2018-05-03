export function replaceAt(str: string, index: number, char: string) {
  if (index < 0 || index >= str.length) {
    return '';
  }

  return str.substr(0, index) + char + str.substr(index + 1);
}