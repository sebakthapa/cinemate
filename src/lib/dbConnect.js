import mongoose from 'mongoose';

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const connectToDatabase = async function () {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error(`N0  environment variable SET: "MONGODB_URI"`);
  }

  try {
    await mongoose.connect(uri, options);
    console.log('Connected to DB ');
  } catch (error) {
    console.log('ERROR connecting to DB \n' + error);
    process.exit(1);
  }
};

export function closeConnection() {
  try {
    return mongoose.connection.close();
  } catch (error) {
    console.log(error);
  }
}

export default connectToDatabase;
