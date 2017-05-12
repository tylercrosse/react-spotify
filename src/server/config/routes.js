import express from 'express';
import path from 'path';
import * as authCtlr from '../controllers/auth';

const router = express.Router();

const sendIndex = (req, res) =>
  res.sendFile(path.resolve(__dirname, '../../../public/index.html'));

router.get('/auth/spotify', authCtlr.spotifyLogin);
router.get('/auth/spotify/callback', authCtlr.spotifyCallback);
router.get('/auth/spotify/refresh_user_data', authCtlr.spotifyRefreshData);
router.get('/auth/spotify/refresh_token', authCtlr.spotifyRefreshToken);
router.get('/auth/validate', authCtlr.checkAuth);
router.get('/index.html', sendIndex);
router.get('/*', sendIndex);

export default router;
