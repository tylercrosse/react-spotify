import express from 'express';
import { routes } from './server/routes.js';
const port = 8888;
const stateKey = 'spotify_auth_state';
const app = express();

app.use(express.static(__dirname + '/public'))
  //  .use(cookieParser());

app.use('/', routes);

app.listen(port, () => {
  console.log('App listening on port '+ port)
})