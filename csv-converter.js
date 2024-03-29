"use strict";
const fs = require('fs');

/**
 * A CSV converter that is responsible to writing the csv to a given file
 */
class CsvConverter {

  static writeToFile(/* string */ fileName, /* Array<{link, text}> */ data) {
    const stream = fs.createWriteStream(fileName);
    stream.once('open', () => {
      stream.write('Link, Text\n');
      data.forEach(row => stream.write(`${row.link}, ${row.text}\n`));
      stream.end();
    });
  }

}

module.exports = CsvConverter;
