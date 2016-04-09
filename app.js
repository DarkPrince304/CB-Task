var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var redis = require('redis');
var elasticsearch = require('elasticsearch');

var client = redis.createClient();
var connectionString = 'http://localhost:9200';
var clientES = new elasticsearch.Client({
	host: connectionString
});

client.on('connect', function() {
	console.log("Connected");
});

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());

app.get('/', function(req, res) {
	res.send(" This is the / Page");
});

app.post('/index', function(req, res) {
	console.log(req.body);
	for ( var i in req.body ) {
		client.set(i, req.body[i], function(err, reply) {
		  console.log(reply);
		});
	}
	clientES.index({
	  index: 'sample',
	  type: 'document',
	  id: '1',
	  body: {
	          name: 'Reliability', 
	          text: 'Reliability is improved if multiple redundant sites are used, which makes well-designed cloud computing suitable for business continuity.'
	  }
	}, function (error, response) {
	  console.log(response);
	});
})

app.get('/index', function(req, res) {
	var param = Object.keys(req.query)[0];

	client.get(param, function(err, reply) {
	  console.log(reply);
	});
});


app.listen(3000);