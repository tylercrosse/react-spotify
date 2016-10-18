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
touch server/env.json
# edit env.json with spotify info as below
npm start
```

in `server/env.json`:
```js
{
  "s_client_id": "your client_id",
  "s_client_secret": "your client_secret",
  "s_redirect_uri": "http://localhost:8888/callback"
};
```