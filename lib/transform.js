const { difference, pick } = require('lodash');

module.exports = {
  pickFields(docs, actualFields, expectedFields) {
    if (expectedFields) {
      log.info('Picking the specified fields...');
      log.debug({ expectedFields }, 'Picking the specified fields');
      const missings = difference(expectedFields, actualFields);
      if (missings.length) {
        throw new VError('Some columns are missing from the CSV: %j', missings);
      }
      docs = docs.map((d) => pick(d, expectedFields));
    }
    return docs;
  },
};
