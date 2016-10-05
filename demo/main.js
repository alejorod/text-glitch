var glitched = false;
var button = document.getElementById('glitch-button');
var glitchEffect = Glitcher.glitch({
  el: document.getElementById('demo')
});

button.addEventListener('click', function() {
  if (glitched) {
    glitchEffect.stop();
    button.textContent = 'start';
  } else {
    glitchEffect.start();
    button.textContent = 'stop';
  }

  glitched = !glitched;
});
