const { ObjectID} = require('mongodb');

const { mongoose } = require('./../server/db/mongoose');
const { Todo } = require('./../server/models/todo');
const { User } = require('./../server/models/user');
/*let id = '58a993e87596db55816a0a50';

if (!ObjectID.isValid(id)) {
    console.log('ID not valid');
}*/

/*Todo.find({
    _id: id
}).then((todos) => {
    console.log('Todos', todos);
});

Todo.findOne({
    _id: id
}).then((todo) => {
    console.log('Todo', todo);
});*/

/*Todo.findById(id).then((todo) => {
    if (!todo) {
    console.log('ID not found');
    }
    console.log('Todo By Id', todo);
}).catch((e) => console.log(e)); */

let id = '58a870cb7d4f7b47ff00667f';

if (!ObjectID.isValid(id)) {
    console.log('ID not valid');
}
User.findById(id).then((user) => {
    if (!user) {
    return console.log('User not found');
    }
    console.log('User by Id', user);
}).catch((e) => console.log(e));