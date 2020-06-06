firebase hosting for now

running locally
===============
- to start the frontend 
  - `npm run start:dev-fe` 
- backend is a little in flux
  ```
  cd functions
  firebase functions:config:get > .runtimeconfig.json
  npm run serve
  ```



deploy
======
```
npm run build
firebase deploy
```
TODO: combine these


add config vars to env 
======================
```
firebase functions:config:set someservice.key="THE API KEY" someservice.id="THE CLIENT ID"
```
