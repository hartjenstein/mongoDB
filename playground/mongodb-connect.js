// const MongoClient = require('mongodb').MongoClient;
// no need for the .MongoClient at the end when we're using object destructuring
const { MongoClient, ObjectID } = require('mongodb');

// let obj = new ObjectID();
// console.log(obj)

// ---- Exkurs ----
/* Example ES6 - Object destructuring - fantastic way to make new variables from an objects properties

    let users = {andrew, mike, bill}
    let {name} = users;
    console.log(name);
    // printing andrew! 
*/

MongoClient.connect('mongodb://localhost:27017/todoApp', (err, db) =>  {
    if(err) {
        return console.log('unable to connect');
    }
    console.log('connected to mongo');

/*db.collection('Todos').insertOne({
    text: 'something something',
    completed: false
}, (err, result) => {
    if (err) {
        return console.log('Unable to insert', todo);
    }
    
    console.log(JSON.stringify(result.ops, undefined, 2));
});*/
// pretty printing..
    // .ops attribute is going to store all the docs we've inserted

db.collection('Users').insertOne({
    name:'Norbert',
    age: 33,
    location: 'NK'
}, (err, result) => {
    if(err) {
        return console.log('unable to insert', Users);
    }
    console.log(JSON.stringify(result.ops, undefined, 2));
});

db.close();
});