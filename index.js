import express from 'express'
const app = express();

app.get('/api',app);

app.listen(5000, ()=> {
console.log('app is running')
}