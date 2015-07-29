module.exports = function (Request) {
    var mongodb = require('mongodb');
    Request.findRecentRequests = function(cb) {
        var d = new Date();
        d.setDate(d.getDate() - 2);

        
        Request.find({"_id":{$gt:  objectIdWithTimestamp(d)}},function(err, data){
           cb(null, data);
        });
    }
    
    Request.remoteMethod(
        'findRecentRequests', 
        {          
          returns: {arg: 'findRecentRequests'}
        }
    );
    
    // This function returns an ObjectId embedded with a given datetime
    // Accepts both Date object and string input
    
    function objectIdWithTimestamp(timestamp) {
        
        // Convert string date to Date object (otherwise assume timestamp is a date)
        if (typeof(timestamp) == 'string') {
            timestamp = new Date(timestamp);
        }
    
        // Convert date object to hex seconds since Unix epoch
        var hexSeconds = Math.floor(timestamp/1000).toString(16);
    
        // Create an ObjectId with that hex timestamp
        var constructedObjectId = mongodb.ObjectId(hexSeconds + "0000000000000000");
    
        return constructedObjectId
    }

};
