const single_puller = `^\$(\.\w+)*$`
const re_single_puller = new RegExp(single_puller);


export function isSinglePuller(rule: string): boolean {
  return re_single_puller.test(rule);
}