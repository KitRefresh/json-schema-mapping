import { buildPullOpt, buildProcessOpt, buildPushOpt } from "./opt-parsers";
import { expect } from 'chai';

describe('Opt-Parser', () => {

  describe('buildPullOpt()', () => {

    it('create correct single puller.', () => {
      let opt = buildPullOpt('$.a.b');

      expect(opt).to.eql({
        type: 'pull',
        sources: ['$.a.b'],
        autowrap: false,
      });
    });

    it('create correct multi puller.', () => {
      let opt = buildPullOpt('$.a, $.b, $.c');
      
      expect(opt).to.eql({
        type: 'pull',
        sources: ['$.a', '$.b', '$.c'],
        autowrap: false,
      });

    });

    it('create empty puller when input is invalid.', () => {
      let opt = buildPullOpt('abc');

      expect(opt).to.eql({
        type: 'pull',
        sources: [],
        autowrap: false,
      })
    });

  });

  describe('buildProcessOpt()', () => {

    it('create correct sliced pipe.', () => {
      let opt = buildProcessOpt('#0:pipe');

      expect(opt).to.eql({
        type: 'process',
        pipeName: 'pipe',
        pipeParameters: [],
        isHyperRule: false,
        sliced: true,
        selectedIndex: 0,
        iterative: false,
      });

    });

    it('raise error when sliced pipe in wrong format.', () => {
      expect(() => buildProcessOpt('#a:pipe')).to.throw(/Invalid pipe with sliced opt/);
    });

    it('create iterative pipe.', () => {
      let opt = buildProcessOpt('~pipe');

      expect(opt).to.eql({
        type: 'process',
        pipeName: 'pipe',
        pipeParameters: [],
        isHyperRule: false,
        sliced: false,
        iterative: true,
      });
    });

    it('create hyper pipe.', () => {
      let opt = buildProcessOpt('@pipe');

      expect(opt).to.eql({
        type: 'process',
        pipeName: 'pipe',
        pipeParameters: [],
        isHyperRule: true,
        sliced: false,
        iterative: false,
      });
    });
    
    it('create param pipe.', () => {
      let opt1 = buildProcessOpt('pipe(1,2,3)');

      expect(opt1).to.eql({
        type: 'process',
        pipeName: 'pipe',
        pipeParameters: ['1', '2', '3'],
        isHyperRule: false,
        sliced: false,
        iterative: false,
      });

      let opt2 = buildProcessOpt("pipe('hi')");

      expect(opt2).to.eql({
        type: 'process',
        pipeName: 'pipe',
        pipeParameters: ['hi'],
        isHyperRule: false,
        sliced: false,
        iterative: false,
      });
    });

    it('create mixed pipe.', () => {
      let opt1 = buildProcessOpt('#1:~@pipe');
      expect(opt1).to.eql({
        type: 'process',
        pipeName: 'pipe',
        pipeParameters: [],
        isHyperRule: true,
        sliced: true,
        selectedIndex: 1,
        iterative: true,
      });

      let opt2 = buildProcessOpt('~pipe(1,2,3)');
      expect(opt2).to.eql({
        type: 'process',
        pipeName: 'pipe',
        pipeParameters: ['1', '2', '3'],
        isHyperRule: false,
        sliced: false,
        iterative: true,
      });

      let opt3 = buildProcessOpt('#1:~pipe(1,2,3)');
      expect(opt3).to.eql({
        type: 'process',
        pipeName: 'pipe',
        pipeParameters: ['1', '2', '3'],
        isHyperRule: false,
        sliced: true,
        selectedIndex: 1,
        iterative: true,
      });

    });

  });

  describe('buildPushOpt()', () => {
    it('create correct simple pusher.', () => {
      let opt = buildPushOpt('T.a');

      expect(opt).to.eql({
        type: 'push',
        target: 'T.a',
        indexed: true,
        selectedIndex: 0,
        iterative: false,
      });
    });

    it('create correct iterative pusher.', () => {
      let opt = buildPushOpt('T.a~b');

      expect(opt).to.eql({
        type: 'push',
        target: 'T.a',
        indexed: true,
        selectedIndex: 0,
        iterative: true,
        iterateKey: 'b'
      })
    });
  });

})