# Spotify Visualization

This app is a visualization of how Spotify relates artists. I'm currently looking for a new position in the greater puget sound region - Hire me!

---
### Demo

You can test a fully working live demo at https://related-artists.herokuapp.com/

---
### Built with

##### <img height="20" src="https://cdn.rawgit.com/tylercrosse/gitter-clone/9c26fc47/src/client/assets/img/react.svg"> [React](https://facebook.github.io/react/)

React makes it really easy to focus on the view in a declarative way. I like that it makes it easy to write composable, testable UI.

##### <img height="20" src="https://cdn.rawgit.com/tylercrosse/gitter-clone/9c26fc47/src/client/assets/img/redux.svg"> [Redux](http://redux.js.org/)

Redux is where the fun is at. Maintain a flat minimal state, with dictionary of normalized objects. I use [reselect](https://github.com/reactjs/reselect) to compute derived data. [Redux devtools](https://github.com/zalmoxisus/redux-devtools-extension) are also great, I kept it enabled on production for anyone wanting to easily take a look at the app's state.

##### <img height="20" src="https://cdn.rawgit.com/tylercrosse/gitter-clone/9c26fc47/src/client/assets/img/webpack.svg"> [Webpack 2](https://webpack.js.org/)

Fantastic code bundler once you get past the learning curve. I use it for a number of things including: transpile ES2015+ javascript to ES5 with [Babel](https://babeljs.io/), compile [Sass](http://sass-lang.com/) into css, optimize assets, hot reload code, build minimized split production code, + more.

##### <img height="20" src="https://cdn.rawgit.com/tylercrosse/gitter-clone/9c26fc47/src/client/assets/img/express.svg"> [Express](https://expressjs.com/)

It's nice to have JS everywhere. Express is fast and minimal. The backend is pretty simple with a router, and handling logging into Spotify via OAuth 2. Logging handled by [winston](https://github.com/winstonjs/winston).

##### <img height="20" src="https://cdn.rawgit.com/tylercrosse/gitter-clone/9c26fc47/src/client/assets/img/jest.svg"> [Jest](http://facebook.github.io/jest/)

Unit tests run by Jest. If you haven't seen Jest recently, you should take another look. [Enzyme](https://github.com/airbnb/enzyme) is used for React support and [SuperTest](https://github.com/visionmedia/supertest) is used for HTTP assertions. [Enzyme-to-JSON](https://github.com/adriantoine/enzyme-to-json) is also great and worth checking out in conjunction with the other test utilities.

##### <img height="20" src="https://cdn.rawgit.com/tylercrosse/gitter-clone/9c26fc47/src/client/assets/img/semaphor.svg"> [SemaphoreCI](https://semaphoreci.com/)

Continuous integration handled by the super fast SemaphoreCI. Passing merges to master are auto deployed with help from [pm2](http://pm2.keymetrics.io/).

---
### Setup

```sh
npm install
touch ./src/server/env.json
# edit env.json with spotify info as below
npm run dev
```

in `./src/server/env.json`:
```js
{
  "s_client_id": "your client_id",
  "s_client_secret": "your client_secret",
  "s_redirect_uri": "http://localhost:8888/callback"
};
```
