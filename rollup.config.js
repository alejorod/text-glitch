import babel from 'rollup-plugin-babel';
import uglify from 'rollup-plugin-uglify';

export default {
  entry: 'src/main.js',
  format: 'umd',
  dest: 'lib/text-glitch.js',
  plugins: [ babel({
    babelrc: false,
    presets: [ 'es2015-rollup' ],
    plugins: [ 'syntax-object-rest-spread', 'transform-object-rest-spread' ]
  }), uglify() ],
  moduleName: 'Glitcher'
};
