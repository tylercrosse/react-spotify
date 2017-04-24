// import path from 'path';
import express from 'express';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import webpack from 'webpack';
import webpackMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import config from '../../webpack.config';
import routes from './routes/routes';

const isDeveloping = process.env.NODE_ENV !== 'production';
const port =  process.env.PORT || 3000;
const app = express();
let env = {};

if (process.env.NODE_ENV !== 'production') {
  env = require('./env.json');
  process.env.session_secret = env.session_secret;
}

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
app.use(express.static('public'));
app.use('/', routes);

if (isDeveloping) {
  const compiler = webpack(config);
  const middleware = webpackMiddleware(compiler, {
    publicPath: config.output.publicPath,
    contentBase: 'src',
    stats: {
      colors: true,
      hash: false,
      timings: true,
      chunks: false,
      chunkModules: false,
      modules: false
    }
  });
  app.use(middleware);
  app.use(webpackHotMiddleware(compiler));
}

app.listen(port, '0.0.0.0', (err) => {
  if (err) {
    console.log(err);
  }
  console.info('==> 🌎 Listening on port %s. Open up http://0.0.0.0:%s/ in your browser.', port, port);
});
