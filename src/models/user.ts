import mongoose, { Schema, Document } from 'mongoose';

/**
 * Interface to model the User Schema for TypeScript.
 * @param email:string
 * @param password:string
 */

export interface IUser extends Document {
  email: string;
  password: string;
  backlog: [{ type : Schema.Types.ObjectId, ref: 'Game' }];
}

const userSchema: Schema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  backlog: [Schema.Types.ObjectId],
});

// Export the model and return your IUser interface
export default mongoose.model<IUser>('User', userSchema);
