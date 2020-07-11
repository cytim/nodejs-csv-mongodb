# csv-mongodb

> Import CSV into MongoDB.

## Preparation for Running or Developing the Program

1. Pull the code to your local machine.

1. Install the Node.js dependencies.

   ```sh
   npm i
   ```

1. Start the MongoDB server.

   ```sh
   docker-compose up
   ```

## Run the Program

1. Prepare the CSV file.

1. Execute the following command to start the program.

   ```sh
   node index.js
   ```

1. Answer the prompted questions.

1. The CSV records will be imported into MongoDB.

## Develop the Program

1. Create a `.env` file to setup the environment variables. Example:

   ```
   LOG_LEVEL=info
   TEST_MONGO_URL=mongodb://demo:demo@localhost:27017
   TEST_MONGO_DB_NAME=demo
   ```

1. Run the test cases (after confirming that MongoDB has started successfully).

   ```sh
   npm run test
   ```

1. Start coding!

1. Before commiting new code, make sure to lint and test it.

   ```sh
   npm run lint
   npm run test
   ```
