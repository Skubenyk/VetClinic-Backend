// * Libraries
const config = require('./config/db');
const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
// * Routes
const users = require('./routes/users/users');
// * Local
const port = process.env.PORT || 8080;
const backendUrl = '/api';
const mongodb = config.db;
const log = console.log;

// * Config
app.use(express.static('frontend/build'));
app.use(express.json());
app.use(cors());

app.use(backendUrl + '/users', users);

// ! Config Mongo DB
mongoose.connect(mongodb, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  dbName: 'VetClinic',
});

// ! Hooks
// * If connected
mongoose.connection.on('connected', () => {
  log('Connected to DB!');
});
// * If error
mongoose.connection.on('error', (error) => {
  log('Connected to DB failed:'(error));
});

// * Routes
// app.post('/test', async (req, res) => {
//   try {
//     const { some } = req.body;
//     res.send([123, '456', true, some]);
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       error: error,
//     });
//   }
// });

// * Default Routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/build/index.html'));
});

// * Run server
app.listen(port, () => {
  log(`Server is running on port ${port}`);
});
