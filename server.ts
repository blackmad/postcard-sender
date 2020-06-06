import app from './functions/src/server';

const port = process.env.PORT || 8080; // default port to listen

app.listen(port, () => {
  console.log("Server running on port 3000");
});
