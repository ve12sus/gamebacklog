import express, {
  Application, Request, Response, NextFunction,
} from 'express';
import mongoose from 'mongoose';
import passport from 'passport';
import { BasicStrategy } from 'passport-http';
import User, { IUser } from './models/user';
import Game, { IGame } from './models/games';

const app : Application = express();
const port = 3000;

mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);

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

passport.use(new BasicStrategy(
  (email, password, done) => {
    User.findOne({ email }).then(user => {
      if (user !== null && user.password !== password) {
        return done(null, false);
      }
      return done(null, user);
    },
    err => { console.log(err); return done(err); });
  },
));

app.post('/users', (req: Request, res: Response) => {
  // make a new user
  const { email, password } = req.body as IUser;
  const user: IUser = new User({
    email, password,
  });
  user.save().then(savedUser => {
    console.log(savedUser); res.status(201); res.send(savedUser);
  },
  err => { console.log(err); res.status(500); });
});

app.get('/users', (req: Request, res: Response) => {
  // get collection of users
  User.find({}).then(users => { console.log(users); res.status(200); res.send(users); },
    err => { console.log(err); res.status(500); });
});

app.get('/users/:id', passport.authenticate('basic', { session: false }), (req: Request, res: Response) => {
  // gets a user
  User.findById(req.params.id).then(foundUser => { res.json(foundUser); res.status(200); },
    err => { console.log(err); res.status(500); });
});

app.put('/users/:id', passport.authenticate('basic', { session: false }), (req: Request, res: Response) => {
  // updates a user
  const { email, password } = req.body as IUser;
  User.findByIdAndUpdate(req.params.id, { email, password }).then(updatedUser => {
    if (updatedUser !== null) {
      updatedUser.save().then(savedUpdatedUser => {
        res.json(savedUpdatedUser); res.status(200);
      },
      err => { console.log(err); res.status(500); });
    }
  },
  err => { console.log(err); res.status(500); });
});

app.delete('/users/:id', passport.authenticate('basic', { session: false }), (req: Request, res: Response) => {
  // deletes a user
  User.findByIdAndDelete(req.params.id).then(deletedUser => {
    res.json(deletedUser); res.status(200);
  },
  err => { console.log(err); res.status(500); });
});

app.post('/users/:id/games', passport.authenticate('basic', { session: false }), (req: Request, res: Response) => {
  // creates a game backlog
  const { name, progress } = req.body as IGame;
  User.findById(req.params.id).then(foundUser => {
    if (foundUser !== null) {
      foundUser.backlog.push({ name, progress } as IGame);
      foundUser.save().then(savedUser => {
        console.log(savedUser); res.status(201); res.json(savedUser);
      },
      err => { console.log(err); res.status(500); });
    }
  },
  err => { console.log(err); res.status(500); });
});

app.delete('/users/:userid/games/:gameid', passport.authenticate('basic', { session: false }), (req: Request, res: Response) => {
  // deletes a game from a user
  User.findById(req.params.userid).then(async foundUser => {
    // success
    if (foundUser !== null) {
      const game = foundUser.backlog.id(req.params.gameid);
      if (game !== null) {
        await game.remove();
        foundUser.save().then(deletedGame => {
          // game deleted
          res.json(deletedGame); res.status(200);
        }, err => {
          // error deleting game
          console.log(err); res.status(500);
        });
      }
    }
  }, err => {
    // error
    console.log(err); res.status(500);
  });
});

app.put('/users/:userid/games/:gameid', passport.authenticate('basic', { session: false }), (req: Request, res: Response) => {
  // updates a game
  const { progress } = req.body as IGame;
  User.findById(req.params.userid).then(foundUser => {
    // success
    if (foundUser !== null) {
      const game = foundUser.backlog.id(req.params.gameid);
      if (game !== null) {
        game.progress = progress;
        foundUser.save().then(newProgress => {
          // game progress updated
          res.json(newProgress); res.status(201);
        }, err => {
          // error updating game
          console.log(err); res.status(500);
        });
      }
    }
  }, err => {
    // error
    console.log(err); res.status(500);
  });
});

// Start server
app.listen(port, () => console.log(`Server is listening on port ${port}!`));
