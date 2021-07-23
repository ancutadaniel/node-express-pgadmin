const express = require('express');
const cors = require('cors');
const knex = require('knex');
const bcrypt = require('bcrypt-nodejs');

//Controllers
const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

const app = express();
const PORT = 8080;
const localhost = 'http://localhost:';

//connection DB
const db = knex({
  client: 'pg',
  connection: {
    host: 'localhost',
    user: 'postgres',
    password: 'dananc123?',
    database: 'practiceDB',
  },
});

// test connection to DB
// console.log(
//   db
//     .select('*')
//     .from('users')
//     .then((data) => console.log('connection to db', data))
// );

// Middleware
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get('/', (req, res) => {
  db.select('*')
    .from('users')
    .then((user) => {
      res.status(200).json(user);
    });
});

app.post('/signin', signin.handleSignIn(db, bcrypt));
// dependencies injections similar above
// first run fct with db and bcrypt and then automatically get req res

app.post('/register', (req, res) => {
  register.handleRegister(req, res, db, bcrypt);
}); // dependencies injections

app.get('/profile/:id', (req, res) => {
  profile.handleProfile(req, res, db);
}); // dependencies injections

app.put('/image', (req, res) => {
  image.handleImage(req, res, db);
}); // dependencies injections

app.listen(PORT || process.env.PORT, () => {
  console.log(`App is running on ${localhost}${PORT}`);
});
