require('../db/mongoose')
const UserRouter = require('../routers/user')
const express = require("express");

const app = express();

const port = process.env.PORT || 3000;

app.use(express.json())
app.use(UserRouter)

app.listen(port , () => {console.log("Connected successfully")})