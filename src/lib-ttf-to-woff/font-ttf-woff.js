import fs from 'fs';
import ttf2woff from 'ttf2woff';


async function convertTTFtoWOFF(inputPath, outputPath) {
    try {
        const ttfBuffer = fs.readFileSync(inputPath); // read file
        const woffBuffer = ttf2woff(ttfBuffer); // file conversion
        fs.writeFileSync(outputPath, Buffer.from(woffBuffer.buffer)); // write file.woff
        console.log('Coversion successful: ', outputPath);
    } catch(error) {
        console.error('Error during conversion: ', error);
    }
}


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
