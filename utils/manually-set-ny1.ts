import admin = require('firebase-admin');

const app = admin.initializeApp();

const db = app.firestore()

// db.collection('templates').doc('ny1').update({
//   template: `My name is [YOUR NAME] and I am a resident of [BOROUGH]. Last April, NYC Mayor Bill De Blasio proposed major budget cuts for the Fiscal Year 2021, especially to education and youth programs, while refusing to slash the NYPD budget by any significant margin.

// I am writing this letter today to demand that you vote no on the Mayor’s FY21 proposed budget. Furthermore, I urge you ONLY to vote for a budget that includes AT LEAST $1 billion in cuts to the NYPD with equal reallocation towards social services and education programs, effective at the beginning of FY21, July 1, 2020.
  
// Governor Cuomo has doubled the presence of the NYPD on New York City streets. I am asking that city officials lobby the same amount of attention and effort towards finding sustainable, longterm change.`
// })

// db.collection('templates').doc('sf1').set({
//   name: 'San Francisco - Letter to the Mayor, Board of Supervisors, and Elected Officers',
//   template: `My name is [YOUR NAME], and I am a resident of San Francisco. This past week, our nation has been gripped by protests calling for rapid and meaningful change with regard to police behavior, an end to racism and anti-Blackness, and immediate reform in how Black people are treated in America. Our city has been at the forefront of much of this action. Accordingly, it has come to my attention that the budget for 2021 is being decided as these protests continue.

// SFPD has been a waste of our resources. Last year, the SFPD budget was $611,701,869, the majority of which comes from the San Francisco general fund. While we've been spending extraordinary amounts on policing, we have not seen improvements to safety, homelessness, mental health, or affordability in our city. Instead, we see wasteful and harmful actions of our police.
  
// I call on you to slash the SFPD budget and instead use those extraordinary resources towards solving homelessness, which is felt most by our Black neighbors and veterans. We implore you to give every member of our community experiencing homelessness a place to call home and the treatment they need.
  
// We can be a beacon for other cities to follow if only we have the courage to change.`
// })

db.collection('templates').doc('philly1').set({
  name: 'Philadelphia - Letter to Mayor and Council Members🔗',
  template: `My name is [NAME], and I am a resident of District [YOUR DISTRICT]. Mayor Kenney’s proposed Philadelphia budget for fiscal year 2021 has proposed a $14 million increase for the Philadelphia police department during a time of economic strife and while other essential social budgets that support the community are being slashed. For example, budgets for library, homeless services, Parks and Recreation, and public health (during the global COVID-19 pandemic!) are all being cut and the city is eliminating its budget for arts and culture entirely.

I urge you to advocate for an ethical reallocation of funds: away from PPD, and towards social services and education programs.
  
I am emailing to ask city officials to please reject any proposed budget that increases taxpayer spending on police while cutting funding for important social and community projects. I am asking that city officials lobby the same amount of attention and effort towards finding sustainable, long term change.`
})