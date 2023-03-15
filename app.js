const express = require('express')
const {join} = require('path')
const app = express()
app.on('request',(req,res)=>{
	//获取GET参数
	let {query} = url.parse(req.url,true);
	//获取post参数
	let postData='';
	req.on('data',(chunk)=>{
		postData+=chunk;
	});
	req.on('end',()=>{
		console.log(querystring.parse(postData));
	});
});

app.use(express.static(join(__dirname, 'src')))
app.use('/api',require('./routes/index.js'));
app.use('*',(req,res)=>{
    res.redirect('/app.html?_='+Date.now())
})
app.listen(80,()=>{
    console.log('80端口已开启');
})
