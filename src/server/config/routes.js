import express from 'express';
import * as authCtlr from '../controllers/auth';

const routes = express.Router();

routes.get('/auth/spotify', authCtlr.spotifyLogin);
routes.get('/auth/spotify/callback', authCtlr.spotifyCallback);
routes.get('/auth/spotify/refresh_user_data', authCtlr.spotifyRefreshData);
routes.get('/auth/spotify/refresh_token', authCtlr.spotifyRefreshToken);
routes.get('/auth/validate', authCtlr.checkAuth);

export default routes;
