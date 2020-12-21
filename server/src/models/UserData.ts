import mongoose, { Schema, Document } from "mongoose"

export interface IUserData extends Document {
  userId: Schema.Types.ObjectId
  budget: Array<Schema.Types.ObjectId>
};

const userDataSchema: Schema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  budget: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Budget"
  }]
})

export default mongoose.model<IUserData>("UserData", userDataSchema)