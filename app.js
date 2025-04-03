const express = require('express');
const { join } = require('path')
const app = express()
app.use('*', function (req, res, next) {
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    next();
});
app.use(express.json())
app.use(express.static(join(__dirname, 'src')))
app.use('/api', require('./routes/index.js'));
app.listen(8082, () => {
    console.log('8082端口已开启');
})
