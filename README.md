firebase hosting for now

running locally
===============
- to start the frontend 
  - `npm run start:dev-fe` 
- backend is a little in flux
  ```
  export STRIPE_PRODUCT_ID=prod_HPs8hjgW1GbBcY
  export STRIPE_API_KEY=xxxxx
  npm run start:dev-be
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
