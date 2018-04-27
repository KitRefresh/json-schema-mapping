export const digits = `[0-9]+`; // 123
export const digits_range_full = `${digits}\\:${digits}(\\:${digits})?`; // 1:2:3 / 1:2
export const digits_range_omit = `((${digits}\\:)|(\\:${digits}))`; // 1: / :2
export const digits_set = `${digits}(,${digits})+`; // 1,2,3
export const arr_suffix = `\\[((${digits})|(${digits_range_full})|(${digits_range_omit})|(${digits_set})|\\*)\\]`;
export const word = `\\w([\\w ])*`; //
export const word_with_arr = `${word}(${arr_suffix})?`;


// data puller
const single_puller = `\\$(\\.${word_with_arr})*`;
const re_single_puller = new RegExp(`^${single_puller}$`);

export function isSinglePuller(rule: string): boolean {
  return re_single_puller.test(rule);
}

const multi_puller = `${single_puller}(,\\s*${single_puller})+`;
const re_multi_puller = new RegExp(`^${multi_puller}$`);

export function isMultiPuller(rule: string): boolean {
  return re_multi_puller.test(rule);
}

// data pusher
const pusher = `T(\\.${word})*`;
const re_pusher = new RegExp(`^${pusher}$`);

export function isPusher(rule: string): boolean {
  return re_pusher.test(rule);
}