const express = require("express")
const {getDropdownData, postLocationData, postUserData, postUpdateData} = require("./repo/formRepo")
const {postInitialGridData} = require("./repo/gridRepo")
const app = express()
const PORT = 8000

app.use((req,res,next)=>{
    res.setHeader("Access-Control-Allow-Headers", "Content-Type")
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE")
    res.setHeader("Access-Control-Allow-Origin", "*")
    next()    
})
app.use(express.json())
app.get("/form",getDropdownData)
app.post("/location",postLocationData)
app.post("/formData",postUserData)
app.post("/grid",postInitialGridData)
app.listen(PORT,()=>{console.log("Server is running on ",PORT);})
