const express = require('express')
const {join} = require('path')

const app = express()
app.use(express.static(join(__dirname, 'public')))
app.use('/',require('./routes/index.js'));
app.listen(3030,()=>{
    console.log('服务器3030已开启');
})