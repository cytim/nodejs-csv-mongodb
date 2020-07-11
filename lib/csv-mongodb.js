const path = require('path');
const { camelCase } = require('lodash');
const transform = require('./transform');
const csv = require('./csv');
const db = require('./mongodb');

module.exports = {
  async import(csvFilePath, csvColumns, mongoURL, mongoDbName) {
    let { cols, docs } = await csv.load(csvFilePath);
    docs = transform.pickFields(docs, cols, csvColumns);

    const collectionName = camelCase(path.basename(csvFilePath, '.csv'));
    await db.insert(mongoURL, mongoDbName, collectionName, docs);
  },
};
