# CB-Task

First run the server using:
```
node app.js
```

To index data into Redis and Elasticsearch one can send a POST request to the "/index"

For example, using curl
```
curl --data "name=Sanchit&age=22" http://localhost:3000/index
```
This will index the data as key-value pairs in Redis and ElasticSearch respectively.

To get data from Redis one can send a GET request to "/index" specifying the string to be searched the "query" parameter.

Example:
```
curl -XGET "http://localhost:3000/index?query=age"
```
The above will return 22

To search data from ES one can send a GET request to "/search" specifying the string to be searched the "query" parameter.

Example:
```
curl -XGET "http://localhost:3000/search?query=Sanchit"
```

This will return a JSON Object containing the hit information if found.
