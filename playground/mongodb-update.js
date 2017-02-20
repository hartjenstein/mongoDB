// const MongoClient = require('mongodb').MongoClient;
// no need for the .MongoClient at the end when we're using object destructuring
const { MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/todoApp', (err, db) =>  {
    if(err) {
        return console.log('unable to connect');
    }
    console.log('connected to mongo');

  // using update operators - like $set
    db.collection('Users').findOneAndUpdate({
        _id: new ObjectID("58a5a30429e19af7fa8d9a0f")
    }, {
        $inc: {
            age: 1,
        }
    }, {
        returnOriginal: false
    // return original is set to true by default and the original data set
    //  - not the updated one is returned - therefor set it to false
    }).then((result) => {
        console.log(result);
    });

  
});