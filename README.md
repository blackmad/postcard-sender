firebase hosting for now

running locally
===============
- to start the frontend - you can do a lot of dev with just this since it's hardcoded to talk to the prod backend apis for now (annoying I know, haven't had time to build out the dev/prod envs for this)
  - `npm run start:dev-fe` 
  
- backend 
  ```
  cd functions
  firebase functions:config:get > .runtimeconfig.json # you need perms from me for the firebase proejct
  npm run serve
  ```



deploy
======
```
npm run build
firebase deploy
```
TODO: combine these


how to config vars to env 
=========================
```
firebase functions:config:set someservice.key="THE API KEY" someservice.id="THE CLIENT ID"
```
