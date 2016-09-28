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
  redirect_uri: 'http://localhost:8888/callback'
};
```