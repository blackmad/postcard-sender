import admin = require('firebase-admin');

const app = admin.initializeApp();

const db = app.firestore()

db.collection('templates').doc('ny1').update({
  template: `My name is David L Blackman and I am a resident of [BOROUGH]. Last April, NYC Mayor Bill De Blasio proposed major budget cuts for the Fiscal Year 2021, especially to education and youth programs, while refusing to slash the NYPD budget by any significant margin.

I am writing this letter today to demand that you vote no on the Mayor’s FY21 proposed budget. Furthermore, I urge you ONLY to vote for a budget that includes AT LEAST $1 billion in cuts to the NYPD with equal reallocation towards social services and education programs, effective at the beginning of FY21, July 1, 2020.
  
Governor Cuomo has doubled the presence of the NYPD on New York City streets. I am asking that city officials lobby the same amount of attention and effort towards finding sustainable, longterm change.`
})