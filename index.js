const express = require('express')
const app = express()
app.use(express.json())
require('dotenv').config()
const port =process.env.PORT || 3093
const serverIP = process.env.yourIP === null ? undefined : process.env.yourIP;
const connectToDb = require("./Config/db")
const profileRoutes = require("./Routes/profileRoutes")
const dateGenerator = require('./Utils/commonUtils')

app.use("/user",profileRoutes)


app.all('*',(req,res)=>{
    res.send("Not found   1111")
})


app.listen(port, serverIP, async () => {
    await connectToDb();
    console.log(`Server is running at Port ${port} and connected to DB`);
});

