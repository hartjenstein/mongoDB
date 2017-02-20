 let mongoose = require('mongoose');
 let User = mongoose.model('User', {
     userName: {
        type: String,
        required: true,
        minlength:1,
        trim: true
     },
     email:{
        type: String,
        required: true,
        minlength:1,
        trim: true
     }
 });
 module.exports = { User };

// beispiel
 /*let newUser = new User({
     user: '  Mongo Mike  ',
     email: ' mongomike@gmail.com  '
 });
 newUser.save().then((doc) => {
     console.log(JSON.stringify(doc, undefined, 2));
 }, (e) => {
    console.log('Unable to to save', e);
 });*/

 