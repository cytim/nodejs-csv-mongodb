const { readFile } = require('fs').promises;
const { extname } = require('path');
const { promisify } = require('util');
const { camelCase, zipObject } = require('lodash');
const csvParse = promisify(require('csv-parse'));

module.exports = {
  async load(filePath) {
    log.info('Loading the CSV file...');
    log.trace('Loading the CSV file: %s', filePath);

    if (extname(filePath) !== '.csv') {
      throw new VError('The CSV file must end with ".csv"');
    }

    try {
      const content = await readFile(filePath);
      let [cols, ...docs] = await csvParse(content);
      cols = cols.map(camelCase);
      docs = docs.map((d) => zipObject(cols, d));

      const result = { cols, docs };
      log.info('Loaded the CSV file successfully');
      log.trace(result, 'Loaded the CSV file successfully');
      return result;
    } catch (err) {
      throw new VError(err, 'Failed to load the CSV file');
    }
  },
};
