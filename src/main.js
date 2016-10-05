const GLITCH_CHARS = '@#><}@{}()@-_*&%@!~abcdefghijkhlmnopqrstjk';

function noise(base, chaos) {
  return base + Math.random() * chaos;
}

function randomIndex(length) {
  return Math.floor(Math.random() * length);
}

function randomValue(collection) {
  return collection[randomIndex(collection.length)];
}

function replaceChar(text, index, char) {
  return text.substr(0, index) + char + text.substr(index + 1, text.length);
}

class Glitcher {
  constructor(DOMElement, {unstableDelta=140, stableDelta=1100, steps=6, charCount=4}) {
    this.$el = DOMElement;
    this.originalText = this.$el.textContent;

    this.animationId = null;
    this.lastUpdate = 0;

    this.stableDelta = stableDelta;
    this.unstableDelta = unstableDelta;
    this.threshold = unstableDelta;
    this.steps = steps;
    this.currentStep = steps;
    this.charCount = charCount;

    this.start = this.start.bind(this);
    this.stop = this.stop.bind(this);
  }

  stop() {
    cancelAnimationFrame(this.animationId);
    this.$el.textContent = this.originalText;
  }

  start(time=0) {
    let delta;

    this.animationId = requestAnimationFrame(this.start);
    this.lastTime = this.lastTime ? this.lastTime : time;

    delta = time - this.lastTime;

    if (delta > this.threshold) {
      this.lastTime = time;
      this._tick();
    }
  }

  _tick() {
    this.threshold = noise(this.unstableDelta, 20);
    if (this.currentStep--) {
      this._update();
    } else {
      this._reset();
    }
  }

  _update() {
    let wordCount = noise(this.charCount, -2);
    let glitchedText = this.originalText;
    let i = 0;
    let index = 0;

    while(i < wordCount) {
      index = randomIndex(this.originalText.length);
      if (!/\s/.test(glitchedText[index])) {
        i++;
        glitchedText = replaceChar(
          glitchedText,
          index,
          randomValue(GLITCH_CHARS)
        );
      }
    }

    this.$el.textContent = glitchedText;
  }

  _reset() {
    this.$el.textContent = this.originalText;
    this.threshold = noise(this.stableDelta, 200);
    this.currentStep = Math.round(noise(this.steps, 3));
  }
}

export default {
  glitch({el, ...config}) {
    return new Glitcher(el, config);
  }
}
