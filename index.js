import express from 'express'
 const app = express();

 app.use("/", (req,res) => {
     res.send('vercel app')
 })


 app.listen(5000, ()=> {
    console.log('app is running')
 }) 