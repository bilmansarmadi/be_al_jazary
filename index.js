import express from 'express'
 const app = express();
 app.use(express.json );

 app.use("/", (req,res) => {
     res.send('vercel app')
 })


 app.listen(5000, ()=> {
    console.log('lapp is running')
 }) 