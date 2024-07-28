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


export {convertTTFtoWOFF};