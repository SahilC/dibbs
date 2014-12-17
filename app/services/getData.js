module.exports = {
	getData: function(url) {
		var http = require('http');
		var body = '';
		http.get(url,function(res){
			//var response = JSON.parse(res);
			res.on('data', function(chunk) {
    		    		body += chunk;
    			});
    			res.on('end', function() {
    		    		var fbResponse = JSON.parse(body);
				console.log(fbResponse);
    			});	
		});
	}		
};
