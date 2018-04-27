import { isSinglePuller, digits, digits_range_full, digits_range_omit, digits_set, arr_suffix, word, word_with_arr, isMultiPuller, isPusher } from './validators';
import { expect } from 'chai';

const buildBooleanListValidator = (toValidateSource: any[], validator: (x: any) => boolean, isTrue: boolean) => {
  const len = toValidateSource.length;
  const results = toValidateSource.map(validator);
  expect(results).to.deep.equal(Array(len).fill(isTrue));
}

describe('Rule validator', () => {
  let buildRegexTestUnit = (regxStr: string, positiveCases: string[], negativeCases: string[]) => {
    return () => {
      const regex = new RegExp(`^${regxStr}$`);
      const tester = (x) => regex.test(x);

      buildBooleanListValidator(positiveCases, tester, true);
      buildBooleanListValidator(negativeCases, tester, false);
    }
  }

  describe('basic regex should work: ', () => {

    it('digits', buildRegexTestUnit(
      digits,
      [ '123', '1', '2' ],
      [ 'f', '1.23', '1,2,3' ]
    ))

    it('digits_range_full', buildRegexTestUnit(
      digits_range_full,
      [ '1:1:2', '1:2' ],
      [ '1', ':', '1:', 'fff', '1:2:3:4', '1::', '1:::2', '1:2:']
    ));

    it('digits_range_omit', buildRegexTestUnit(
      digits_range_omit,
      [ '1:', ':2' ],
      [ '1:2', '3:3:4', ':', '1' ]
    ));

    it('digits_set', buildRegexTestUnit(
      digits_set,
      [ '1,2,3', '1,2' ],
      [ '1', '1,', '' ]
    ))

    it('arr_suffix', buildRegexTestUnit(
      arr_suffix,
      [ '[*]', '[1:2]', '[2]', '[1,2]', '[:2]', '[2:]' ],
      [ '[', ']', '[]', '[1|2]', '[1:2', '1,2]']
    ))

    it('word', buildRegexTestUnit(
      word,
      [ 'a', 'asd', 'a ', '_a', '_ a', '_ ' ],
      [ '.', ',', '[', '+', '!', ' ', ' a' ]
    ))

    it('puller_token', buildRegexTestUnit(
      word_with_arr,
      [ 'a', 'a[*]', 'a[1]', 'a[1:2]', '_a [1]' ],
      [ '', 'a[]', '..', '[]' ]
    ))

  });

  describe('validators should work: ', () => {

    describe('isSinglePuller', () => {

      it('should return true for normal paths.', () => {
        const toValidate = [
          '$',
          '$.a',
          '$.a.b',
          '$.a.b.c'
        ];

        buildBooleanListValidator(toValidate, isSinglePuller, true);
      });

      it('should return true for array paths.', () => {
        const toValidate = [
          '$.a[*]',
          '$.a[1:3]',
        ];

        buildBooleanListValidator(toValidate, isSinglePuller, true);
      });

      it('should return false.', () => {
        const toValidate = [
          '$.',
          '$.[]',
          '$.a[]',
          'T.a',
          'a.b.c',
          ''
        ];

        buildBooleanListValidator(toValidate, isSinglePuller, false);
      });
    });

    describe('isMultiPuller', () => {

      it('should return true.', () => {

        const toValidate = [
          '$.a, $.a.b, $.a.b[1]'
        ];
        
        buildBooleanListValidator(toValidate, isMultiPuller, true);
      })

      it('should return false.', () => {
        const toValidate = [
          '$.a',
          '$.a, b.c, $.avb'
        ];

        buildBooleanListValidator(toValidate, isMultiPuller, false);
      });

    });

    describe('isPusher', () => {

      it('should return true.', () => {
        const toValidate = [
          'T.a.b',
          'T',
          'T.a_b',
          'T.a b.c'
        ];

        buildBooleanListValidator(toValidate, isPusher, true);
      });

      it('should return false.', () => {
        const toValidate = [
          'T.a[]',
          '$.asd',
          'asd',
          'T.a[1]',
        ];

        buildBooleanListValidator(toValidate, isPusher, false);
      });

    });


  })

})