const express = require('express');
const app = express();
const serv = require('http').Server(app);

app.get('/', function(req, res){
		res.sendFile(__dirname + '/public/index.html');
});
app.use('/public', express.static(__dirname +'/public'));

serv.listen(process.env.PORT || 2000);
console.log('server started');
