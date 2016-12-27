
var MongoClient = require('mongodb').MongoClient,
    assert = require('assert');
var ObjectID = require('mongodb').ObjectID;
// Connection URL
var url = 'mongodb://127.0.0.1:27017/test';

// Use connect method to connect to the Server
MongoClient.connect(url, function(err, db) {

    //ensure we've connected
    assert.equal(null, err);


    console.log("Connected correctly to server");

    var bankData = db.collection('bank_data');

    bankData.insert({
        'first_name': "Blaze",
        'last_name': "Baley",
        'accounts': []
    }, function(err, docs) {

        if (err) {
            console.error(err);
        }
        console.log(docs);

        var updatedUser = docs[0];
        updatedUser.first_name = 'Blazet';

        bankData.update({
            '_id': new ObjectID(updatedUser._id)
        }, updatedUser, {
            w: 1
        }, function(err, count) {
            console.log("Updated " + count + " documents") 
        });

        bankData.findOne({ _id: updatedUser._id }, function(err, doc) {
            if(err) {
                console.error(err);
                //close the database connection
                return db.close();
            }
            
            console.log('Read 1 doc');
            console.log(doc);
            
            bankData.remove({ first_name: /^Blaze/}, function(err, count) {
               
                if(err) {
                    console.error(err);
                    return db.close();
                }
                
                console.log("Removed " + count + " docs");
                 
                //close the database connection
                return db.close();
                
            });
            
        });

        
    });

});