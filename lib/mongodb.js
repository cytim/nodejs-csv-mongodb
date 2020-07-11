const MongoClient = require('mongodb').MongoClient;

async function getClient(url) {
  return await MongoClient.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
}

module.exports = {
  async insert(url, dbName, collectionName, docs) {
    log.info('Inserting the docs to MongoDB...');
    log.trace({ docs }, 'Inserting the docs to MongoDB');
    try {
      const client = await getClient(url);
      const collection = client.db(dbName).collection(collectionName);
      const ops = docs.map((document) => ({ insertOne: { document } }));
      await collection.bulkWrite(ops);
      client.close();
      log.info('Inserted the docs to MongoDB successfully');
    } catch (err) {
      throw new VError(err, 'Failed to insert the docs to MongoDB');
    }
  },
};
