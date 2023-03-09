import express from 'express'
const app = express();

app.use("./app", app)


app.listen(5000, ()=> {
console.log('app is running')
}) 