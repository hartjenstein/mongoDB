// server file is just for our routes now
let express = require('express');
//body-parser converts JSON into an object 
let bodyParser = require('body-parser');
// destructing object - ES6 (saving the mongoose return value in the variable)
const { ObjectID } = require('mongodb');
let { mongoose } = require('./db/mongoose');
let { Todo } = require('./models/todo');
let { User } = require('./models/user');

let app = express();
//crud - create read update delete
const port = process.env.PORT || 3000; 
app.use(bodyParser.json());

app.post('/todos', (req, res) => {
   let todo = new Todo({
       text: req.body.text
    });

    todo.save().then((doc) => {
    res.send(doc);
    }, (e) => {
    res.status(400).send(e);
    });
});
// sending todos as an array (res.send(todos)) would not allow us to add any properties
// with ES6 we can send it as an object: res.send({todos})
app.get('/todos', (req, res) => {
    Todo.find().then((todos) => {
        res.send({todos});
    }, (e) => {
        res.status(400).send(e);
    });
});

// GET / todos / 12345454
app.get('/todos/:id', (req, res) => {
   // res.send(req.params.id);
    let id = req.params.id;
    //check if the id is valid
    if (!ObjectID.isValid(id)) {
       return res.status(404).send();
    }   
    Todo.findById(id).then((todo) => {
            if(!todo) {
                return res.status(404).send();
            }
            res.status(200).send({todo});
        }).catch((e) => {
            res.status(400).send();
        });   
    }); 
app.listen(port, () => {
    console.log(`started on port ${port}`);
});

// ES6 syntax
module.exports = {app};