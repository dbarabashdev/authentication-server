const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const expressjwt = require('express-jwt');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 8888;

const users = [
  { id: 1, username: 'admin', password: 'admin' },
  { id: 2, username: 'quest', password: 'quest' }
];

app.use(bodyParser.json());
app.use(cors());

const jwtCheck = expressjwt({
  secret: 'secretkey'
});

app.get('/resources', (req, res) => {
  res.status(200).send('Public resources, you can see it');
});

app.get('/resources/secret', jwtCheck, (req, res) => {
  res.status(200).send('Public resources, should be logged in to see this');
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400).send('You need a username and password');
    return;
  }

  const user = users.find(u => {
    return u.username === username && u.password === password;
  });

  if (!user) {
    res.status(401).send('User not found');
    return;
  }

  const token = jwt.sign(
    {
      sub: user.id,
      username: user.username
    },
    'secretkey',
    { expiresIn: '3 hours' }
  );

  res.status(200).send({ access_token: token });

  res.status(200).send(`You logged in with ${user}`);
});

app.get('*', (req, res) => {
  res.sendStatus(404);
});

app.listen(PORT, () => {
  console.log(`Server is running in port ${PORT}`);
});
