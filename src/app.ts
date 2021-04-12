import express, {
  Application, Request, Response, NextFunction,
} from 'express';
import mongoose from 'mongoose';
import User from './models/user';
import Game from './models/games';

const app : Application = express();
const port = 3000;

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/test', { useNewUrlParser: true, useUnifiedTopology: true }).then(
  () => {},
  () => {},
);

app.post('/users', async (req: Request, res: Response) => {
  // make a new user
  const user = await User.create(req.body);
  res.status(200).json(user);
});

app.get('/users/:id', (req: Request, res: Response) => {
  // get a user by id
  res.send(req.params.id);
});

app.get('/users', (req: Request, res: Response) => {
  // get collection of users
  const users = await User.find({}).exec();
  res.json(users);
});

app.put('/users/:id', (req: Request, res: Response) => {
  // edit a user
});

app.delete('/users/:id', (req: Request, res: Response) => {
  // deletes a user
});

app.get('/users/:id/games', (req: Request, res: Response) => {
  // get a list of user's games
  const games = await User.find({}).populate("games").exec();
  res.json(games);
});

app.put('/users/:id/games', (req: Request, res: Response) => {
  // updates a user's backlog of games
});

app.use('/', (req: Request, res: Response, next: NextFunction) => {
  res.send(req.query.hello);
});

// Start server
app.listen(port, () => console.log(`Server is listening on port ${port}!`));
