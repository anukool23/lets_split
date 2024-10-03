const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const helmet = require('helmet')
const cors = require('cors')
app.use(cors())
app.use(express.json())
app.use(bodyParser.json())
const responseTime = require('response-time')
app.use(responseTime())
app.use(helmet())
require('dotenv').config()
const port =process.env.PORT || 3093
const serverIP = process.env.yourIP === null ? undefined : process.env.yourIP;
const connectToDb = require("./Config/db")
const userRoutes = require("./Controller/userRoutes")
const journeyRoutes = require("./Controller/journeyRoutes")
const dateGenerator = require('./Utils/commonUtils')

app.use("/user",userRoutes)
app.use("/journey",journeyRoutes);


app.all('*',(req,res)=>{
    res.send("This API is not valid, please check your API")
})

app.get("/", (req, res) => {
    res.status(200).send("Connected")
})


app.listen(port, serverIP, async () => {
    await connectToDb();
    console.log(`Server is running at Port ${port} , ${serverIP} and connected to DB`);
});

