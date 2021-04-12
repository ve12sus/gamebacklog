import mongoose, { Schema, Document } from 'mongoose';

/**
 * Interface to model the Game Schema for TypeScript.
 * @param name:string
 * @param progress:string
 */

export interface IGame extends Document {
  name: string;
  progress: string;
}

const GameSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  progress: {
    type: String,
    required: true,
  },
});

// Export the model and return your IGame interface
export default mongoose.model<IGame>('Game', GameSchema);
