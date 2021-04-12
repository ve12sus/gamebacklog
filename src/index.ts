import mongoose, { Schema, Document } from 'mongoose';

mongoose.connect('mongodb://localhost:27017/test', { useNewUrlParser: true, useUnifiedTopology: true }).then(
  () => {},
  () => {},
);

interface IUser extends Document {
  name: string;
}

interface IGame extends Document {
  name: string;
}

const UserSchema: Schema = new Schema({
  name: { type: String, required: true },
  games: [Schema.Types.ObjectId],
});

const GameSchema: Schema = new Schema({
  name: { type: String, required: true },
});

const Game = mongoose.model<IGame>('Gser', GameSchema);

const User = mongoose.model<IUser>('User', UserSchema);

const user = new User({ name: 'Zildjian' });

user.save().then(() => console.log('hello')).then(
  () => {},
  () => {},
);
