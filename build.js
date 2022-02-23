import { createWriteStream, readFileSync } from 'fs';
import { promisify } from 'node:util';
import stream from 'node:stream';
import fs from 'node:fs';
import got from 'got';
import glob from 'glob';
import { keyboardDefinitionV2ToVIADefinitionV2 } from 'via-reader';
import { exit } from 'process';

const viaUrl = "https://www.caniusevia.com/keyboards.v2.json";

async function getFile(url, out){
    const pipeline = promisify(stream.pipeline);
    await pipeline(
        got.stream(url),
        fs.createWriteStream(out)
    );
}

async function main(){
    // Download VIA official keyboards JSON
    await getFile(viaUrl, './via_official_keyboards.json');

    // Load official data
    let data = JSON.parse(readFileSync('./via_official_keyboards.json').toString());

    let defs = data.definitions;
    let vidpids = Object.keys(defs);
    const official = vidpids.length;

    console.log(`${official} keyboards found in the official VIA database.`);

    // Load ViaMia keyboards
    let jsons = glob.sync('./keyboards/**/*.json');
    for (const keyboard of jsons) {
        // Load JSON
        console.log(`Processing ${keyboard}`);
        let keyboard_data = JSON.parse(fs.readFileSync(keyboard).toString());

        // Convert to VIA format
        let via_data = keyboardDefinitionV2ToVIADefinitionV2(keyboard_data);
        let keyboard_vidpid = via_data.vendorProductId;

        // Check if vidpid is unique
        if(vidpids.includes(keyboard_vidpid.toString())){
            throw new Error(`Keyboard file ${keyboard} does not have a unique Vendor or Product ID.`);
            exit(1);
        }else{
            // Append to keyboards & vidpid list (so ViaMia duplicates are also detected)
            vidpids.push(keyboard_vidpid.toString());
            data.definitions[keyboard_vidpid] = via_data;
        }
    }

    // Set date
    data.generatedAt = + new Date();

    console.log(`Finished. Added ${vidpids.length - official} keyboards.`);

    // Write final JSON
    fs.writeFileSync('keyboards.v2.json', JSON.stringify(data));

    // Clean up
    fs.unlinkSync('via_official_keyboards.json');
}

main();