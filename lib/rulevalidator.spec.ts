import { isSinglePuller } from "./rulevalidator";
import { expect } from 'chai';

describe('Rule validator', () => {

  describe('isSinglePuller()', () => {
    it('should return true.', () => {
      expect(isSinglePuller('$')).to.equal(true);
      expect(isSinglePuller('$.a')).to.equal(true);
      expect(isSinglePuller('$.a.b')).to.equal(true);
      expect(isSinglePuller('$.a.b.c')).to.equal(true);
      expect(isSinglePuller('$.a[*]')).to.equal(true);
      expect(isSinglePuller('$.a[1:3]')).to.equal(true);
    });

    it('should return false.', () => {
      expect(isSinglePuller('$.')).to.equal(false);
      expect(isSinglePuller('$.[]')).to.equal(false);
      expect(isSinglePuller('$.a[]')).to.equal(false);
      expect(isSinglePuller('T.a')).to.equal(false);
      expect(isSinglePuller('a.b.c')).to.equal(false);
      expect(isSinglePuller('')).to.equal(false);
    });
  })

})