var http = require("http");

http.createServer(function (request, response) {
   // Send the HTTP header 
   // HTTP Status: 200 : OK
   // Content Type: text/plain
   response.writeHead(200, {'Content-Type': 'text/plain'});
   
   // Send the response body as "Hello World"
   response.end('Hello World\n');
}).listen(8081);


var MongoClient = require('mongodb').MongoClient;

var uri = "mongodb+srv://admin:admin@cluster1-zdxhq.mongodb.net/test";
MongoClient.connect(uri, function(err, client) {
   //const collection = client.db("test").collection("devices");
   // perform actions on the collection object
   if (err) throw err;
   console.log('connected')
    var dbo = client.db("myfirstDB")

   //client.close();
   
});

// Console will print the message
console.log('Server running at http://127.0.0.1:8081/');