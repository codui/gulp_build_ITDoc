// gulpfile.mjs
import gulp from 'gulp';
import rename from 'gulp-rename';
import cleanCSS from 'gulp-clean-css';

// import dartSass from 'sass';
import gulpSass from 'gulp-sass';
import * as scss from 'sass'
const sass = gulpSass(scss);

import sourcemaps from 'gulp-sourcemaps';
import postcss from 'gulp-postcss';
import autoprefixer from 'autoprefixer';
import babel from 'gulp-babel';
import uglify from 'gulp-uglify';
import concat from 'gulp-concat';
import imagemin from 'gulp-imagemin';
// import del from 'del';
import { deleteAsync } from 'del';
import htmlmin from 'gulp-htmlmin';

// Paths to files
const paths = {
    html: {
        src: 'src/*.html', // source from where the source files .scss will be taken
        dest: 'dist' // final folder with ready-made files .css
    },
    styles: {
        src: 'src/styles/**/*.scss', // source from where the source files .scss will be taken
        dest: 'dist/css/' // final folder with ready-made files .css
    },
    scripts: {
        src: 'src/scripts/**/*.js', // source from where the source files .js will be taken
        dest: 'dist/js/' // final folder with ready-made files .js
    },
    images: {
        src: 'src/img/*',
        dest: 'dist/img'
    }
};

async function clean() { // Cleaning folders
    return deleteAsync(['dist']); // specify the folder that will be deleted
}

// Processing style files. Compilation of SCSS into CSS and other operations
function styles() {
    return gulp.src(paths.styles.src)
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError)) // compiling SCSS to CSS
        .pipe(postcss([autoprefixer()]))
        .pipe(cleanCSS()) // minification of CSS files - removal of spaces, extra ";", all paragraphs
        .pipe(rename({
            basename: 'main',
            suffix: '.min'
        }))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(paths.styles.dest));
}

// Processing javascript files
function scripts() {
    return gulp.src(paths.scripts.src)
        .pipe(sourcemaps.init())
        .pipe(babel({
            presets: ['@babel/env']
        })) // transpiles javascript code into old standard code javascript, for old browsers
        .pipe(uglify()) // minifies, compresses and optimizes javascript files
        .pipe(concat('main.min.js')) // combine the files into one and immediately give the name to the combined file
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(paths.scripts.dest))
}

function img() {
    return gulp.src(paths.images.src, { encoding: false })
        .pipe(imagemin({
            progressive: true
        }))
        .pipe(gulp.dest(paths.images.dest));
}


function htmlMinify() {
    return gulp.src(paths.html.src)
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(gulp.dest(paths.html.dest));
}

function watch() { // Track changes
    gulp.watch(paths.styles.src, styles);
    /* first, we specify the path to the files that we will track, 
    then a task (function) is transmitted, which 
    will be executed when changing in these files */
    gulp.watch(paths.scripts.src, scripts);
}

// Export functions as tasks
export { clean, styles, scripts, img, htmlMinify, watch };

// series() performs tasks in sequence
const build = gulp.series(clean, htmlMinify, gulp.parallel(styles, scripts, img), watch);
// const buildParalel = gulp.parallel(clean, styles); // parallel() performs tasks in parallel

export { build };
export default build; // Just write in terminal gulp
