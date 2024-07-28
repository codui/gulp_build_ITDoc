import fs from 'fs';
import {convertTTFtoWOFF} from './font-ttf-woff.js'


function getFilesInDirectory(dirPath) {
    return new Promise((resolve, reject) => {
        fs.readdir(dirPath, (err, files) => {
            if (err) {
                reject('Inable to scan directory: ' + err);
            }
            resolve(files);
        })
    })
}

// ! WORK VERSION
// getFilesInDirectory(directoryPath)
//     .then( files => {
//         files.forEach(file => {
//             let fileFontName = file.split('.')[0];
//             convertTTFtoWOFF(`./src/fonts/${fileFontName}.ttf`, `./dist/fonts/${fileFontName}.woff`)
//         });
//         console.log('Files in directory: ', files);
//         // console.log('cwd ', cwd());
//     })
//     .catch(error => {
//         console.error(error);
//     });

async function makeConvert(directoryFontsPath = './src/fonts') {
    let sourceInputTtfFonts = './src/fonts/';
    let sourceOutputTtfFonts = './dist/fonts/';
    try {
        let files = await getFilesInDirectory(directoryFontsPath); // get font files with extension .ttf
        files.forEach(file => {
            let fileFontName = file.split('.')[0];
                convertTTFtoWOFF(`${sourceInputTtfFonts}${fileFontName}.ttf`, `${sourceOutputTtfFonts}${fileFontName}.woff`)
        });
    } catch (err) {
        console.error(err);
    }  
}

export {makeConvert};
