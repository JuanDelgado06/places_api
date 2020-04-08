const createError = require('http-errors');
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const logger = require('morgan');
const jwtMiddleware = require('express-jwt');

//const Application = require('./models/Application');
//Importando las rutas de places
const places = require('./routes/places');
const users = require('./routes/users');
const sessions = require('./routes/sessions');
const favorites = require('./routes/favorites');
const visits = require('./routes/visits');
const visitPlaces = require('./routes/visitPlaces');
const applications = require('./routes/applications');
//Importando la configuración de la base de datos
const db = require('./config/db');
const secrets = require('./config/secrets');
//Conectandonos a la base de datos
db.connect();

const app = express();

app.use(morgan('dev'));
app.use(cors());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(
  jwtMiddleware({secret: secrets.jwtSecret})
    .unless({path: ['/sessions', '/users'], method: 'GET'})
)

//Rutas de la api
app.use('/places', places);
app.use('/places', visitPlaces);
app.use('/users', users);
app.use('/sessions', sessions);
app.use('/favorites', favorites);
app.use('/visits', visits);
app.use('/applications', applications);

/* app.get('/demo', function(req, res) {
  Application.remove({}).then(r => res.json(r))
}) */

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json(err);
});

module.exports = app;
