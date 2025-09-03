import fs from 'fs';
import exifr from 'exifr';
import mysql from 'mysql2/promise';
import dbCredentials from './db-credentials.js';

// DO NOT RUN - PLEASE DO NOT RUN THIS IT WILL CREATE DUPLICATES!
process.exit();

const imageFolder = './frontendx/images';
const db = await mysql.createConnection(dbCredentials);
let files = fs.readdirSync(imageFolder).filter(x => x.endsWith('.JPG'));

for (let file of files) {
  let metadata = await exifr.parse(imageFolder + '/' + file);
  let [result] = await db.execute(
    `INSERT INTO images(fileName, metadata) VALUES(?,?)`,
    [file, metadata]
  );
  console.log(file, result);
}

process.exit();