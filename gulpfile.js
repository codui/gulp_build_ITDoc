// gulpfile.mjs
import gulp from 'gulp';
import rename from 'gulp-rename';
import cleanCSS from 'gulp-clean-css';

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
import webp from 'gulp-webp';
import webpHtml from 'gulp-webp-html-nosvg';

import { deleteAsync } from 'del';
import htmlmin from 'gulp-htmlmin';
import size from 'gulp-size';
import newer from 'gulp-newer';

import browserSync from 'browser-sync';
browserSync.create();

import ttf2woff2 from 'gulp-ttf2woff2';
import { makeConvert } from './src/lib-ttf-to-woff/font-ttf-woff.js';

// Paths to files
const paths = {
    fonts: {
        src: 'src/fonts/*.ttf',
        dest: 'dist/fonts'
    },
    html: {
        src: 'src/*.html', // source from where the source files .scss will be taken
        dest: 'dist' // final folder with ready-made files .css
    },
    styles: {
        src: 'src/scss/**/*.scss', // source from where the source files .scss will be taken
        dest: 'dist/css/' // final folder with ready-made files .css
    },
    scripts: {
        src: 'src/scripts/**/*.js', // source from where the source files .js will be taken
        dest: 'dist/js/' // final folder with ready-made files .js
    },
    images: {
        src: 'src/images/**',
        dest: 'dist/images'
    }
};


async function clean() { // Cleaning folders
    return deleteAsync(['dist/*']); // '!dist/images' specify the folder that will be deleted
}


async function ttfToWoff() {
    return makeConvert();
}


function fontsTask(done) {
    return gulp.src(paths.fonts.src)
        .pipe(ttf2woff2())
        .pipe(gulp.src(paths.fonts.src))
        .pipe(gulp.dest(paths.fonts.dest))
        .on('end', done);
}


function imgTask() {
    return gulp.src(paths.images.src, { encoding: false }) // {encoding: false} чтобы gulp корректно обрабатывал изображения
        .pipe(newer(paths.images.dest))
        .pipe(webp())

        .pipe(gulp.src(paths.images.src, { encoding: false }))
        .pipe(newer(paths.images.dest))
        .pipe(imagemin({
            progressive: true
        }))

        .pipe(size({
            showFiles: true
        }))
        .pipe(gulp.dest(paths.images.dest));
}


function htmTask() {
    return gulp.src(paths.html.src)
        .pipe(webpHtml())
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(size({
            showFiles: true
        }))
        .pipe(gulp.dest(paths.html.dest))
        .pipe(browserSync.stream());
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
        .pipe(size({
            showFiles: true
        }))
        .pipe(gulp.dest(paths.styles.dest))
        .pipe(browserSync.stream());
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
        .pipe(size({
            showFiles: true
        }))
        .pipe(gulp.dest(paths.scripts.dest))
        .pipe(browserSync.stream());
}


function watch() { // Track changes
    browserSync.init({
        server: {
            baseDir: "./dist"
        }
    });
    gulp.watch(paths.html.src, htmTask);
    gulp.watch(paths.styles.src, styles);
    /* first, we specify the path to the files that we will track, 
    then a task (function) is transmitted, which 
    will be executed when changing in these files */
    gulp.watch(paths.scripts.src, scripts);
    gulp.watch(paths.images.src, imgTask);
    gulp.watch(paths.fonts.src, fontsTask);
    gulp.watch(paths.html.dest).on('change', browserSync.reload);
}

// Export functions as tasks
export { clean, fontsTask, ttfToWoff, styles, scripts, imgTask, htmTask, watch };

// series() performs tasks in sequence
const build = gulp.series(clean, fontsTask, htmTask, ttfToWoff, gulp.parallel(styles, scripts, imgTask), watch);
// const buildParalel = gulp.parallel(clean, styles); // parallel() performs tasks in parallel


export { build };
export default build; // Just write in terminal gulp