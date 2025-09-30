import mongoose from "mongoose";

const connectDB = async (url) => {
  try {
    mongoose.connection.on('connected', () => {
      console.log('Mongoose connected to db');
    });
    await mongoose.connect(`${process.env.MONOGODB_URI}/Authentication_System`);
    
  } catch (error) {
    console.log(error);
  }
};

export default connectDB;