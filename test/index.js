require('../setup');

const _ = require('lodash');
const assert = require('chai').assert;
const path = require('path');
const prompts = require('prompts');
const MongoClient = require('mongodb').MongoClient;

const main = require('..');

if (!process.env.TEST_MONGO_URL || !process.env.TEST_MONGO_DB_NAME) {
  throw new Error('Failed to start the test: Missing MongoDB config');
}

const config = {
  mongo: {
    url: process.env.TEST_MONGO_URL,
    dbName: process.env.TEST_MONGO_DB_NAME,
  },
  csv: {
    person: path.resolve(__dirname, './files/person.csv'),
  },
};

function createUserInputs(...inputs) {
  return [config.mongo.url, config.mongo.dbName, ...inputs];
}

describe('Test importing CSV to MongoDB', function () {
  async function mongoFindAll(collectionName) {
    const cursor = await mongoClient
      .db(config.mongo.dbName)
      .collection(collectionName)
      .find();
    const docs = await cursor.toArray();
    docs.forEach((doc) => delete doc._id);
    return docs;
  }

  async function mongoDropCollection(collectionName) {
    try {
      await mongoClient.db(config.mongo.dbName).dropCollection(collectionName);
    } catch (err) {
      // ignore the error
    }
  }

  const data = [
    {
      firstName: 'TIM',
      lastName: 'WONG',
      age: '50',
      height: '1.80',
      sex: 'MALE',
    },
    {
      firstName: 'JOHN',
      lastName: 'DOE',
      age: '29',
      height: '1.77',
      sex: 'MALE',
    },
    {
      firstName: 'JANE',
      lastName: 'DOE',
      age: '32',
      height: '1.87',
      sex: 'FEMALE',
    },
  ];

  let mongoClient;
  before(async function () {
    mongoClient = await MongoClient.connect(config.mongo.url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  after(function () {
    mongoClient && mongoClient.close();
  });

  describe('Load invalid CSV files', function () {
    it('fail to load the CSV because the file extension is not ".csv"', async function () {
      const csvFilePath = path.resolve(__dirname, './files/invalid.json');
      prompts.inject(createUserInputs(csvFilePath));
      try {
        await main();
        assert.fail('should not reach this line');
      } catch (err) {
        assert.include(err.message, 'must end with ".csv"');
      }
    });

    it('fail to load the CSV because the file does not exist', async function () {
      const csvFilePath = path.resolve(__dirname, './files/unknown.csv');
      prompts.inject(createUserInputs(csvFilePath));
      try {
        await main();
        assert.fail('should not reach this line');
      } catch (err) {
        assert.include(err.message, 'ENOENT: no such file or directory');
      }
    });

    it('fail to load the CSV because the content is invalid', async function () {
      const csvFilePath = path.resolve(__dirname, './files/invalid.csv');
      prompts.inject(createUserInputs(csvFilePath));
      try {
        await main();
        assert.fail('should not reach this line');
      } catch (err) {
        assert.include(err.message, 'Invalid Opening Quote');
      }
    });
  });

  describe('Import the records into MongoDB', function () {
    beforeEach(() => mongoDropCollection('person'));
    after(() => mongoDropCollection('person'));

    it('reject importing the records because the "weight" column is missing', async function () {
      const csvColumns = [
        'firstName',
        'lastName',
        'age',
        'weight',
        'height',
        'sex',
      ];
      prompts.inject(createUserInputs(config.csv.person, csvColumns));
      try {
        await main();
        assert.fail('should not reach this line');
      } catch (err) {
        assert.include(err.message, 'Some columns are missing');
      }
    });

    it('import the records with all the columns ("columns" is unspecified)', async function () {
      prompts.inject(createUserInputs(config.csv.person));
      await main();

      const docs = await mongoFindAll('person');
      assert.deepEqual(docs, data.slice(1));
    });

    it('import the records with the specified columns', async function () {
      const csvColumns = ['firstName', 'lastName', 'age'];
      prompts.inject(createUserInputs(config.csv.person, csvColumns));
      await main();

      const docs = await mongoFindAll('person');
      assert.deepEqual(
        docs,
        data.slice(1).map((d) => _.pick(d, csvColumns))
      );
    });

    it('import the records to the existing collection', async function () {
      // Prepare the collection.
      await mongoClient
        .db(config.mongo.dbName)
        .collection('person')
        .insertOne(_.clone(data[0]));

      prompts.inject(createUserInputs(config.csv.person));
      await main();

      const docs = await mongoFindAll('person');
      assert.deepEqual(docs, data);
    });
  });
});
