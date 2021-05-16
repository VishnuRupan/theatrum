import { MongoClient } from "mongodb";

export const connectToDatabase = async () => {
  let client = null;

  try {
    client = await MongoClient.connect(
      `mongodb+srv://${process.env.USER_NAME}:${process.env.PASSWORD}@${process.env.CLUSTER}.ifrpx.mongodb.net/${process.env.DATABASE}?retryWrites=true&w=majority`,
      { useUnifiedTopology: true }
    );
  } catch (error) {
    throw new Error("Could not connect to server");
  }

  return client;
};
