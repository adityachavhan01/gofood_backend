const connectToMongo = require('./db')

const express = require('express')

const cors = require('cors') ;

connectToMongo();

const app  = express();
const port = 5000;

// app.use((req,res,next)=>{
//     req.setHeader("Acsess-Control-Allow-Origin","http://localhost:3000");
//     res.header(
//         "Access-Control-Allow_Header",
//         "Origin, X-Requested-With,Content-Type,Accept"
//     );
//     next();
// })
app.use(cors({
    origin: 'http://localhost:3000', // Allow requests only from this origin
  }));
  
app.use(express.json()) //midlle ware

// required routes
app.use('/api/auth', require('./routes/auth'))
app.use('/api/DisplayData', require('./routes/DisplayData'))


// app.get('/',(req,res)=>{
//     res.send("hi welcome ")
// })

app.listen(port,()=>{
    console.log(`gofood app listening on port ${port}`)
})