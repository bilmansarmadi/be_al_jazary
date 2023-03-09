import express from 'express'
 const app = express();
 var menuRouter                = require('./api/Master/Menu/Menu');
 
 app.use("/", (req,res) => {
     res.send('kayapalah biar konek')
 })

 app.use('/api/Master/Menu', menuRouter);


 app.listen(5000, ()=> {
    console.log('app is running')
 }) 