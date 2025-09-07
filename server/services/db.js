const { MongoClient, ServerApiVersion } = require("mongodb");
const constants = require("../modules/constants");
require("dotenv").config();

const isLocalDb = process.env.LOCAL_DB === "true";
const uri = isLocalDb ? process.env.MONGO_DB_LOCAL_CONNECTION_STRING : process.env.MONGO_DB_ATLAS_CONNECTION_STRING;

client = null;

if (isLocalDb) {
  console.log("Connecting to local database");
  client = new MongoClient(uri);
} else {
  console.log("Connecting to Atlas database");
  client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });
}

async function connectToDb() {
  try {

    const db = await client.db(constants.MONGO_DB_NAME);
    console.log("Connected to the database")
    return db;

  } catch (error) {
    console.error("Error initiating connection to the database: ", error);
    throw error;
  }
}



async function deleteDocument(uuid, collectionName) {
  const db = await connectToDb();
  const collection = db.collection(collectionName);
  const result = await collection.deleteOne({ uuid: uuid });
  // await closeDbConnection(client);
}

async function deleteManyDocument(query, collectionName) {
  const db = await connectToDb();
  const collection = db.collection(collectionName);
  const result = await collection.deleteMany(query);
  // await closeDbConnection(client);
  return result;
}

async function insertDocument(data, collectionName) {
  const db = await connectToDb();
  const collection = db.collection(collectionName);
  const result = await collection.insertOne(data);
  // await closeDbConnection(client);
  if (result.insertedId == null) {
    data["status"] = constants.STATUS.FAIL;
    data["message"] = "Unable to insert data into database.";
  } else {
    data["status"] = constants.STATUS.SUCCESS;
    data["message"] = "";
  }
  return data;
}

async function findDocument(query, collectionName) {
  const db = await connectToDb();
  const collection = db.collection(collectionName);
  const result = await collection.findOne(query);
  // await closeDbConnection(client);
  return result;
}

async function findMultipleDocuments(query, collectionName) {
  const db = await connectToDb();
  const collection = db.collection(collectionName);
  const result = await collection.find(query).toArray();
  // await closeDbConnection(client);
  return result;
}
async function updateDocument(query, data, collectionName, option) {
  const db = await connectToDb();
  const collection = db.collection(collectionName);
  //const update = { $set: data };
  const result = await collection.updateOne(query, data, option);
  // await closeDbConnection(client);
  console.log("result", result);

  if (result.matchedCount > 0 && result.modifiedCount > 0) {
    return {
      status: constants.STATUS.SUCCESS,
      message: "Document updated successfully.",
    };
  } else if (result.upsertedCount > 0) {
    return {
      status: constants.STATUS.SUCCESS,
      message: "Document inserted successfully.",
    };
  } else if (result.matchedCount > 0) {
    return {
      status: constants.STATUS.FAIL,
      message: "No changes were made to the document.",
    };
  } else {
    return {
      status: constants.STATUS.FAIL,
      message: "No document matched the provided query.",
    };
  }
}

async function updateManyDocument(query, data, collectionName, option) {
  const db = await connectToDb();
  const collection = db.collection(collectionName);
  //const update = { $set: data };
  const result = await collection.updateMany(query, data, option);
  // await closeDbConnection(client);
  console.log("result", result);

  if (result.matchedCount > 0 && result.modifiedCount > 0) {
    return {
      status: constants.STATUS.SUCCESS,
      message: "Document updated successfully.",
    };
  } else if (result.upsertedCount > 0) {
    return {
      status: constants.STATUS.SUCCESS,
      message: "Document inserted successfully.",
    };
  } else if (result.matchedCount > 0) {
    return {
      status: constants.STATUS.FAIL,
      message: "No changes were made to the document.",
    };
  } else {
    return {
      status: constants.STATUS.FAIL,
      message: "No document matched the provided query.",
    };
  }
}

async function replaceDocument(query, data, collectionName) {
  const db = await connectToDb();
  const collection = db.collection(collectionName);

  const result = await collection.replaceOne(query, data);
  // await closeDbConnection(client);

  if (result.matchedCount > 0 && result.modifiedCount > 0) {
    return {
      status: constants.STATUS.SUCCESS,
      message: "Document updated successfully.",
    };
  } else if (result.matchedCount > 0) {
    return {
      status: constants.STATUS.FAIL,
      message: "No changes were made to the document.",
    };
  } else {
    return {
      status: constants.STATUS.FAIL,
      message: "No document matched the provided query.",
    };
  }
}

async function closeDbConnection(client) {
  if (client) {
    await client.close();
  }
}

module.exports = {
  connectToDb,
  deleteDocument,
  deleteManyDocument,
  insertDocument,
  closeDbConnection,
  findDocument,
  findMultipleDocuments,
  updateDocument,
  updateManyDocument,
  replaceDocument,
};
