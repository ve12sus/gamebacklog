import express, {
  Application, Request, Response, NextFunction,
} from 'express';
import mongoose from 'mongoose';
import User, { IUser } from './models/user';
import Game from './models/games';

const app : Application = express();
const port = 3000;

app.use(express.json());

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/test',
      { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Mongodb connected...');
  } catch (err) {
    console.error('failed to connect to mongoose', err);
    throw err;
  }
};

connectDB().catch((err) => { console.log('connect db failed', err); throw err; });

app.post('/users', (req: Request, res: Response) => {
  // make a new user
  const { email, password } = req.body as IUser;
  console.log(email);
  console.log(password);
  const user: IUser = new User({
    email, password,
  });
  user.save().then(savedUser => {
    console.log(savedUser); res.status(200); res.send(savedUser);
  },
  err => { console.log(err); res.status(500); });
});

app.get('/users', (req: Request, res: Response) => {
  // get collection of users
  User.find({}).then(users => { console.log(users); res.status(200); res.send(users); },
    err => { console.log(err); res.status(500); });
});

app.get('/users/:id', (req: Request, res: Response) => {
  // gets a user
  User.findById(req.params.id).then(foundUser => { res.json(foundUser); res.status(200); },
    err => { console.log(err); res.status(500); });
});

app.put('/users/:id', (req: Request, res: Response) => {
  // updates a user
  const { email, password } = req.body as IUser;
  User.findByIdAndUpdate(req.params.id, { email, password }).then(updatedUser => {
    res.json(updatedUser); res.status(200);
  },
  err => { console.log(err); res.status(500); });
});

app.delete('/users/:id', (req: Request, res: Response) => {
  // deletes a user
  User.findByIdAndDelete(req.params.id).then(deletedUser => {
    res.json(deletedUser); res.status(200);
  },
  err => { console.log(err); res.status(500); });
});

/* app.put('/users/:id/games', (req: Request, res: Response) => {
  // updates a user's backlog of games
});

app.use('/', (req: Request, res: Response, next: NextFunction) => {
  res.send(req.query.hello);
}); */

// Start server
app.listen(port, () => console.log(`Server is listening on port ${port}!`));
