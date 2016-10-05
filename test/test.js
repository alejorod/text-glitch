import { assert } from 'chai';
import Glitcher from '../src/main';


function getDomElementMock(text) {
  return {
    textContent: text
  };
}

function patchGlobal(funcName) {
  let mock = {
    called: false,
    callCount: 0
  };

  global[funcName] = function() {
    mock.called = true;
    mock.callCount++;
  };

  return mock;
}

describe('Glitcher', function() {
  describe('# glitch', function() {
    it('should call requestAnimationFrame to handle animation', function() {
      let rafMock = patchGlobal('requestAnimationFrame');
      let domElement = getDomElementMock('test content');
      let glitch = Glitcher.glitch({
        el: domElement
      });

      glitch.start();
      assert.strictEqual(true, rafMock.called);
      assert.strictEqual(1, rafMock.callCount);
    });

    it('should call cancelAnimationFrame to stop the animation', function() {
      let rafMock = patchGlobal('requestAnimationFrame');
      let cafMock = patchGlobal('cancelAnimationFrame');
      let domElement = getDomElementMock('test content');
      let glitch = Glitcher.glitch({
        el: domElement
      });

      glitch.start();
      assert.strictEqual(true, rafMock.called);
      assert.strictEqual(1, rafMock.callCount);

      glitch.stop();
      assert.strictEqual(true, cafMock.called);
      assert.strictEqual(1, cafMock.callCount);
    });

    it('should change the text when animation starts', function() {
      let domElement = getDomElementMock('test content');
      let diffCount = 0;
      let glitch = Glitcher.glitch({
        el: domElement,
        unstableDelta: 100, // this is so it gets unscrambled immediatly
      });

      patchGlobal('requestAnimationFrame');
      patchGlobal('cancelAnimationFrame');

      glitch.lastTime = 1;
      glitch.start(110);

      Array.prototype.forEach.call('test content', function(char, i) {
        if (char !== domElement.textContent[i]) {
          diffCount++;
        }
      });

      assert.isAtMost(diffCount, 4);
      assert.isAbove(diffCount, 0);
    });

    it('should reset the original text when animation stops', function() {
      let domElement = getDomElementMock('test content');
      let glitch = Glitcher.glitch({
        el: domElement,
        unstableDelta: -1, // this is so it gets unscrambled immediatly
      });

      patchGlobal('requestAnimationFrame');
      patchGlobal('cancelAnimationFrame');

      glitch.start();
      assert.notEqual('test content', domElement.textContent);

      glitch.stop();
      assert.strictEqual('test content', domElement.textContent);
    });

    it('should reset the original text when all frames are done', function() {
      let domElement = getDomElementMock('test content');
      let glitch = Glitcher.glitch({
        el: domElement,
        unstableDelta: -1, // this is so it gets unscrambled immediatly
      });

      patchGlobal('requestAnimationFrame');
      patchGlobal('cancelAnimationFrame');

      glitch.currentStep = 1;
      glitch.start();

      assert.notEqual('test content', domElement.textContent);

      glitch.threshold = -1;
      glitch.start();

      assert.strictEqual('test content', domElement.textContent);
    });
  });
});
