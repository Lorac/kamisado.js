const gulp = require('gulp')
const babel = require('gulp-babel')
const minify = require('gulp-minify')

gulp.task('default', () => {
  return gulp.src('./kamisado.js')
      .pipe(babel({
        presets: ['es2015']
      }))
      .pipe(minify())
      .pipe(gulp.dest('dist'))
})
