require('./setup');

const path = require('path');
const prompts = require('prompts');
const { camelCase, identity } = require('lodash');
const csvMongodb = require('./lib/csv-mongodb');

function validateRequiredTextInput(val) {
  return !!val || 'The field is required.';
}

/**
 * Start the program by prompting the user for inputs.
 */
async function main() {
  const inputs = await prompts([
    {
      type: 'text',
      name: 'mongoURL',
      message: 'MongoDB Connection String',
      validate: validateRequiredTextInput,
    },
    {
      type: 'text',
      name: 'mongoDbName',
      message: 'MongoDB Database Name',
      validate: validateRequiredTextInput,
    },
    {
      type: 'text',
      name: 'csvFilePath',
      message: 'CSV File Path',
      format: (val) => path.resolve(val),
      validate: validateRequiredTextInput,
    },
    {
      type: 'list',
      name: 'csvColumns',
      message: 'CSV Columns (optional)',
      initial: null,
      format: (val) => {
        const res = val.filter(identity).map(camelCase);
        return res.length ? res : null;
      },
    },
  ]);

  log.trace({ inputs }, 'Collected the user inputs');
  await csvMongodb.import(
    inputs.csvFilePath,
    inputs.csvColumns,
    inputs.mongoURL,
    inputs.mongoDbName
  );
}

// Execute the program if it is called directly.
if (require.main === module) {
  main().catch((err) => log.error(err.message));
}

module.exports = main;
