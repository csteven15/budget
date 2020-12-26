import mongoose from "mongoose";

export default (db: string) => {
  const connect = () => {
    mongoose
      .connect(
        db,
        {
          useNewUrlParser: true,
          useCreateIndex: true,
          useUnifiedTopology: true
        }
      )
      .then(() => {
        console.info(`Successfully connected to ${db}`);
      })
      .catch(error => {
        console.error(`Error connecting to database: `, error);
      });
  };
  connect();

  mongoose.connection.on("disconnected", connect);
};