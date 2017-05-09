import express        from 'express';
import compression    from 'compression';
import session        from 'express-session';
import cookieParser   from 'cookie-parser';
import expressWinston from 'express-winston';
import logger, {
  errLogger,
  reqLogger }         from './config/logger';
import router         from './config/routes';

const isDeveloping = process.env.NODE_ENV !== 'production';
const port =  process.env.PORT || 3000;
const app = express();
let env = {};

if (isDeveloping) {
  logger.info('🚧  in dev 🚧');
  env = require('./env.json');
  process.env.session_secret = env.session_secret;
}

// session middleware
app.use(cookieParser());
app.use(session({
  secret: process.env.session_secret,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: false
  }
}));
app.use((req, res, next) => {
  res.locals.current_user = (req.session.current_user || null);
  next();
});

// webpack middleware for dev
if (isDeveloping) {
  const webpackDevMiddlewareInstance = require('./config/devConfig.js').webpackDevMiddlewareInstance;
  const webpackHotMiddlewareInstance = require('./config/devConfig.js').webpackHotMiddlewareInstance;

  app.use(webpackDevMiddlewareInstance);
  app.use(webpackHotMiddlewareInstance);
}

app.use(compression());
app.use(expressWinston.logger({
  winstonInstance: reqLogger
}));
// routing
app.use(express.static('public'));
app.use('/', router);

// error logging
app.use(expressWinston.errorLogger({
  winstonInstance: errLogger
}));

app.listen(port, '0.0.0.0', (err) => {
  if (err) {
    logger.error(err);
  }
  logger.info('==> 🌎 Listening at http://0.0.0.0:%s/', port);
});
