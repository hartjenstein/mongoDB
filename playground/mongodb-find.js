// const MongoClient = require('mongodb').MongoClient;
// no need for the .MongoClient at the end when we're using object destructuring
const { MongoClient, ObjectID } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/todoApp', (err, db) =>  {
    if(err) {
        return console.log('unable to connect');
    }
    console.log('connected to mongo');

// fetching docs, converting them to an array and printing them to the screen
/*db.collection('Todos').find({
    _id: new ObjectID('58a448fa420065dd2b35383c') 

}).toArray().then((docs) => {
    console.log('Todos');
    console.log(JSON.stringify(docs, undefined, 2));
}), (err) => {
    console.log('Unable to fetch', err);
};*/
db.collection('Todos').find().count().then((count) => {
    console.log(`Todos count: ${count}`);
}), (err) => {
    console.log('Unable to fetch', err);
};
db.collection('Users').find({name: 'Dolores'}).toArray().then((docs) => {
    console.log(`Users with Name Dolores:`);
    console.log(JSON.stringify(docs, undefined, 2));
}), (err) => {
    console.log('Unable to fetch', err);
};
db.close();
});