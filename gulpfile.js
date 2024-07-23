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
        src: 'src/styles/**/*.scss', // источник откуда будут браться исходные файлы
        dest: 'dist/css/' // конечная папка с готовыми файлами
    },
    scripts: {
        src: 'src/scripts/**/*.js', // источник где будут исходные файлы
        dest: 'dist/js/' // конечная папка с готовыми файлами
    }
};

async function clean() { // Cleaning folders
    const { deleteAsync } = await import('del');
    return deleteAsync(['dist']); // Указываем папку, которая будет очищаться
}

// Processing style files. Compilation of SCSS into CSS and other operations
function styles() {
    return gulp.src(paths.styles.src // Передаём путь откуда берутся файлы для обработки
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
        ).on('error', sass.logError)) // Компиляция SCSS в CSS
        // .pipe(postcss([autoprefixer({
        //     cascade: false
        // })]))
        // ! .pipe(sourcemaps.write())
        .pipe(cleanCSS()) // Минификация файлов CSS - удаление пробелов, лишних ";", всех абзацов
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
        .pipe(babel()) // Транспилирует код в код старого стандарта, для старых браузеров
        .pipe(uglify()) // Минифицирует, сжимает и оптимизирует код
        .pipe(concat('main.min.js')) // Объединяем файлы в один и сразу даём название объединённому файлу
        .pipe(gulp.dest(paths.scripts.dest))
}

function watch() { // Отслеживаем изменения
    gulp.watch(paths.styles.src, styles); // Сперва указываем путь к файлам которые будем отслеживать, потом передаётся таска (функция) которая будет выполняться при изменении в этих файлах
    gulp.watch(paths.scripts.src, scripts);
}



// Экспортируем задачи
exports.clean = clean; // "cleaner" - name of command in gulp, "clean" - name of our function
exports.styles = styles;
exports.scripts = scripts;
exports.watch = watch;

// series() выполняет задачи последовательно
const buildSeris = gulp.series(clean, gulp.parallel(styles, scripts), watch);
// const buildParalel = gulp.parallel(clean, styles); // parallel() выполняет задачи паралельно

exports.build = buildSeris; // To run task write in terminal 'gulp build'
exports.default = buildSeris; // Just write in terminal gulp'