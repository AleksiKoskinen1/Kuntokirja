//const http = require('http'); //importing http

console.log("idle");

/*
function startKeepAlive(){
setInterval(function() {
	        var options = {
	            host: 'aleksi-kuntokirja.herokuapp.com',
	            path: '/'
	        };
	        http.get(options, function(res) {
	            res.on('data', function(chunk) {
	                try {
	                    console.log("HEROKU RESPONSE: " + chunk);
	                } catch (err) {
	                    console.log(err.message);
	                }
	            });
	        }).on('error', function(err) {
	         //   console.log("Error: " + err.message);
	        });
	    }, 1 * 5 * 1000); // load every 20 minutes

}

startKeepAlive();*/