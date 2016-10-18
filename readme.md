##

D3 + React Front End
Express backend
Webpack as the build tool

I learned a lot from:
- [Example D3 React Integration](https://github.com/nicolashery/example-d3-react)
- [Webpack Express Boilerplate](https://github.com/christianalfoni/webpack-express-boilerplate)

## Startup

```sh
npm install
touch secrets.js
# edit secrets.js with spotify info as below
npm start
```

> secrets.js

```js
export const secrets = {
  client_id: 'your client_id',
  client_secret: 'your client_secret',
  redirect_uri: 'http://0.0.0.0:3000/callbackk'
};
```
