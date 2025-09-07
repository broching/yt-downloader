const express = require('express');
require('dotenv').config();
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
app.use(cors());
app.use(bodyParser.json()); 

// Routes
const user_routes = require("./routes/user");
app.use("/user", user_routes);


app.get('/', (req, res) => {
  res.send('Welcome to the server!');
});


app.listen(process.env.BACKEND_PORT, () => {
  console.log(`Server is running on http://localhost:${process.env.BACKEND_PORT}`);
});