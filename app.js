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
	for ( var i in req.body ) {
		client.set(i, req.body[i], function(err, reply) {
		  console.log(reply);
		});
	}
	clientES.index({
	  index: 'cloud',
	  type: 'boost',
	  body: req.body
	}, function (error, response) {
	  console.log(response);
	});
})

app.get('/index', function(req, res) {
	var param = req.query["query"];

	client.get(param, function(err, reply) {
	  console.log(reply);
	});
});

app.get('/search', function(req, res) {
	var param = req.query["query"];
	clientES.search({
	    index: 'cloud',
        type: 'boost',
        body: {
            query: {
                query_string:{
                	query: param
                }
            }
        }
    }).then(function (resp) {
        console.log(JSON.stringify(resp["hits"]["hits"]));
    }, function (err) {
        console.log(err.message);
    });
})

app.listen(3000);