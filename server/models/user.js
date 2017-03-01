const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

let UserSchema = new mongoose.Schema({
     userName: {
        type: String,
        minlength:1,
        trim: true
     },
     email:{
        type: String,
        required: true,
        minlength:1,
        trim: true,
        unique: true,
        validate: {
            validator: validator.isEmail,
            message: '{VALUE} is not a valid email'
        }
     }, 
     password: {
         type: String,
         required: true,
         minLength: 6
     },
     tokens: [{
         access: {
            type: String,
            required: true
         },
         token:{
            type: String,
            required: true
         }
     }]
});
// overriding the .toJSON method so the user doesnt get the whole json file returned
UserSchema.methods.toJSON = function(){
    let user = this;
    let userObject = user.toObject();
// the user should only get id and email returned - using lodash method pick for this
    return _.pick(userObject, ['_id', 'email']);
};
// UserSchema.methods is an object on which we generate instance methods 
UserSchema.methods.generateAuthToken = function(){
    let user = this;
    
    let access = 'auth';
    //user.id ist die payload // 'abc123' ist 'the secret' - add on zum hash, den nur der sender kennt.
    let token = jwt.sign({_id: user._id.toHexString(), access}, process.env.JWT_SECRET ).toString();


    user.tokens.push({access, token});
// .save() returns a promise 
    return user.save().then(() => {
// with the callback of the promise we just return a value, which is perfectly fine
// the value then can be chained onto the next promise       
        return token;
    });
};
// defining an instance method - removeToken()
UserSchema.methods.removeToken = function (token) {
    let user = this;
    // returning it so we can chain it 
   return user.update({
        $pull: {
            tokens: {token}
        }
    });
};
UserSchema.statics.findByToken = function (token) {
  var User = this;
  var decoded;

  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (e) {
    return Promise.reject();
  }

  return User.findOne({
    '_id': decoded._id,
    'tokens.token': token,
    'tokens.access': 'auth'
  });
};
// .statics is a model method
// using a regular function because we need the binding of the this keyword
UserSchema.statics.findByCredentials = function (email, password) {
    let User = this;

   return User.findOne({email}).then((user) => {
        if(!user){
            return Promise.reject();
        }
        return new Promise((resolve, reject) => { 
            bcrypt.compare(password, user.password, (err, res) => {
            if(res){
                resolve(user);
            }
                reject();
            });
        });
    });
};
UserSchema.pre('save', function (next) {
    var user = this;

    if(user.isModified('password')) {
        // user.password
        bcrypt.genSalt(10,(err, salt) => {
            bcrypt.hash(user.password, salt, (err, hash) => {
                user.password = hash;
                next(); 
            });
        });
        //user.password = hash
        // next()
    } else {
        next();
    }
});
 let User = mongoose.model('User', UserSchema);
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
