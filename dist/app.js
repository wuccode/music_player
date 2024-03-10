const express = require('express');
const {join} = require('path')
const app = express()
app.use('*',function (req, res, next) {
  res.header('Access-Control-Allow-Origin', req.headers.origin);
  res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
  res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
  if (req.method == 'OPTIONS') {
    res.send(200);
  }
  else {
    next();
  }
});
app.use(express.json())
app.use(express.static(join(__dirname, 'src')))
app.use('/api',require('./routes/index.js'));
app.use('/',(req,res)=>{
    res.redirect('/app.html?_='+Date.now())
})
app.listen(80,()=>{
    console.log('80端口已开启');
})