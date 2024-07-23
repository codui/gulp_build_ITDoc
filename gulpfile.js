const gulp = require('gulp');
const rename = require('gulp-rename');
const cleanCSS = require('gulp-clean-css');
const sass = require('gulp-sass')(require('sass'));
const postcss = require('gulp-postcss');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');

// ! const sourcemaps = require('gulp-sourcemaps')
// ! const autoprefixer = require('autoprefixer');

// Paths to files
const paths = {
    styles: {
        src: 'src/styles/**/*.scss', // source from where the source files .scss will be taken
        dest: 'dist/css/' // final folder with ready-made files .css
    },
    scripts: {
        src: 'src/scripts/**/*.js', // source from where the source files .js will be taken
        dest: 'dist/js/' // final folder with ready-made files .js
    }
};

async function clean() { // Cleaning folders
    const { deleteAsync } = await import('del');
    return deleteAsync(['dist']); // specify the folder that will be deleted
}

// Processing style files. Compilation of SCSS into CSS and other operations
function styles() {
    return gulp.src(paths.styles.src // pass the path from where the files for processing come from
        //     , {
        //     sourcemaps: true
        // }
        )
        // ! .pipe(sourcemaps.init())
        .pipe(sass(
            //     {
            //     outputStyle: 'expanded',
            //     indentWidth: 4,
            // }
        ).on('error', sass.logError)) // compiling SCSS to CSS
        // .pipe(postcss([autoprefixer({
        //     cascade: false
        // })]))
        // ! .pipe(sourcemaps.write())
        .pipe(cleanCSS()) // minification of CSS files - removal of spaces, extra ";", all paragraphs
        .pipe(rename({
            basename: 'main',
            suffix: '.min'
        }))
        .pipe(gulp.dest(paths.styles.dest));
}

// Processing javascript files
function scripts() {
    return gulp.src(paths.scripts.src, {
        sourcemaps: true
    })
        .pipe(babel()) // transpiles javascript code into old standard code javascript, for old browsers
        .pipe(uglify()) // minifies, compresses and optimizes javascript files
        .pipe(concat('main.min.js')) // combine the files into one and immediately give the name to the combined file
        .pipe(gulp.dest(paths.scripts.dest))
}

function watch() { // Track changes
    gulp.watch(paths.styles.src, styles); 
    /* first, we specify the path to the files that we will track, 
    then a task (function) is transmitted, which 
    will be executed when changing in these files */
    gulp.watch(paths.scripts.src, scripts);
}



// Export tasks
exports.clean = clean; // "cleaner" - name of command in gulp, "clean" - name of our function
exports.styles = styles;
exports.scripts = scripts;
exports.watch = watch;

// series() performs tasks in sequence
const buildSeris = gulp.series(clean, gulp.parallel(styles, scripts), watch);
// const buildParalel = gulp.parallel(clean, styles); // parallel() performs tasks in parallel

exports.build = buildSeris; // To run task write in terminal 'gulp build'
exports.default = buildSeris; // Just write in terminal gulp'