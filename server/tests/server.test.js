const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');
const {User} = require('../models/user');
const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const { todos, populateTodos, users, populateUsers } = require('./seed/seed');

beforeEach(populateUsers);
beforeEach(populateTodos);

describe('POST /todos', () => {
  it('should create a new todo', (done) => {
    let text = 'Test todo text';

    request(app)
      .post('/todos')
      .send({text})
      .expect(200)
      .expect((res) => {
        expect(res.body.text).toBe(text);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.find({text}).then((todos) => {
          expect(todos.length).toBe(1);
          expect(todos[0].text).toBe(text);
          done();
        }).catch((e) => done(e));
      });
  });

  it('should not create todo with invalid body data', (done) => {
    request(app)
      .post('/todos')
      .send({})
      .expect(400)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.find().then((todos) => {
          expect(todos.length).toBe(2);
          done();
        }).catch((e) => done(e));
      });
  });
});

describe('GET /todos', () => {
  it('should get all todos', (done) => {
    request(app)
      .get('/todos')
      .expect(200)
      .expect((res) => {
        expect(res.body.todos.length).toBe(2);
      })
      .end(done);
  });
});

describe('GET /todos/:id', () => {
  it('should return todo doc', (done) => {
    request(app)
      .get(`/todos/${todos[0]._id.toHexString()}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(todos[0].text);
      })
      .end(done);
  });

  it('should return 404 if todo not found', (done) => {
    let hexId = new ObjectID().toHexString();

    request(app)
      .get(`/todos/${hexId}`)
      .expect(404)
      .end(done);
  });

  it('should return 404 for non-object ids', (done) => {
    request(app)
      .get('/todos/123abc')
      .expect(404)
      .end(done);
  });
});

describe('DELETE /todos/:id', () => {
  it('should remove a todo', (done) => {
    let hexId = todos[1]._id.toHexString();

    request(app)
      .delete(`/todos/${hexId}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo._id).toBe(hexId);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.findById(hexId).then((todo) => {
          expect(todo).toNotExist();
          done();
        }).catch((e) => done(e));
      });
  });

  it('should return 404 if todo not found', (done) => {
    let hexId = new ObjectID().toHexString();

    request(app)
      .delete(`/todos/${hexId}`)
      .expect(404)
      .end(done);
  });

  it('should return 404 if object id is invalid', (done) => {
    request(app)
      .delete('/todos/123abc')
      .expect(404)
      .end(done);
  });
});
describe('PATCH /todos/:id', () => {
  it('should update the todo doc', (done) => {
      let hexId = todos[0]._id.toHexString();
      let text = 'this should be the new text';
    request(app)
      .patch(`/todos/${hexId}`)
      .send({
          completed: true,
          text
      })
      // grab id of first item
      // update text, set completed to true
      // 200
      // response needs text property - text is changed, completed is true, completedAt is number  
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(text);
        expect(res.body.todo.completed).toBe(true);
        expect(res.body.todo.completedAt).toBeA('number');
      }) 
      .end(done);    
  });
     
  it('should clear completedAt when todo is not completed', (done) => {
     let hexId = todos[1]._id.toHexString();
     let text = 'this should be the new text';
     request(app)
      .patch(`/todos/${hexId}`)
      .send({
          completed: false,
          text
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(text);
        expect(res.body.todo.completed).toBe(false);
        expect(res.body.todo.completedAt).toBe(null);
      })
      .end(done);  
    // grab id of second todo // update text, set completed to false
    // 200
    // text is changed , completed is false, completedAt is null
  });
});
describe('GET / users / me', () => {
  it('should return user if authenticated', (done) => {
    request(app)
    .get('/users/me')
    .set('x-auth', users[0].tokens[0].token)
    .expect(200)
    .expect((res) => {
      expect(res.body._id).toBe(users[0]._id.toHexString());
      expect(res.body.email).toBe(users[0].email);
    })
    .end(done);
  }); 

  it('should return 401 if not authenticated', (done) => {
    request(app)
    .get('/users/me')
    .expect(401)
    .expect((res) => {
      expect(res.body).toEqual({});
    })  
    .end(done);
  });
});
describe('POST / users', () => {

  it('should create a user', (done) => {
    let email = 'example@example.com';
    let password = '123mnb';

    request (app)
      .post('/users')
      .send({email, password})
      .expect(200)
      .expect((res) => {
        // need to use bracket notation instead of . notation 
        // because the header name has a hyphen in it
        expect(res.headers['x-auth']).toExist();
        expect(res.body._id).toExist();
        expect(res.body.email).toBe(email);
      })
      // instead of done we are passing in one of our custom functions - this way we can check the database.
      .end((err) => {
        if(err) {
          return done(err);
        }

        User.findOne({email}).then((user) => {
          expect(user).toExist();
          // since our passwords are getting hashed we can expect the in the database stored password 
          // is not to equal the password variable, we've used above.
          expect(user.password).toNotBe(password);
          done();
        }).catch((e) => done(e));
      });
  });

  it('should return validation errors if request is invalid', (done) => {
     let email = 'exampleexample.com';
     let password = '123mn';

     request (app)
      .post('/users')
      .send({email, password})
      .expect(400)
      .end(done);
  });

  it('should not create user if email is in use', (done) => {
    let email = users[0].email;
    let password = users[0].password;
    request (app)
      .post('/users')
      .send({
        email, 
        password
      })
      .expect(400)
      .end(done);
      
  }); 
});
  /* .expect((res) => {
        User.findOne({email}).then((email) => {
        expect(email).NotToExist();
        });
      })*/
describe('POST / users / login', () => {

  it('should login user and return auth token', (done) => {
    request(app)
      .post('/users/login')
      .send({
        email: users[1].email,
        password: users[1].password
      })
      .expect(200)
      .expect((res) => {
        // x-auth has to be queried with [] instead of a . because the name has a hyphen in it.
        expect(res.headers['x-auth']).toExist();
      })
      .end((err,res) => {
        if(err) {
          return done(err);
        }
      User.findById(users[1]._id).then((user) => {
        expect(user.tokens[0]).toInclude({
          access: 'auth',
          token: res.headers['x-auth']
        });
        done();
      }).catch((e) => done(e));
    });
  });

  it('should reject invalid login', (done) => {
request(app)
      .post('/users/login')
      .send({
        email: users[1].email,
        password: users[1].password + 'duh'
      })
      .expect(400)
      .expect((res) => {
        // x-auth has to be queried with [] instead of a . because the name has a hyphen in it.
        expect(res.headers['x-auth']).toNotExist();
      })
      .end((err,res) => {
        if(err) {
          return done(err);
        }
      User.findById(users[1]._id).then((user) => {
        expect(user.tokens.length).toEqual(0);
        done();
      }).catch((e) => done(e));
    });
  });

});
describe('DELETE / users / me / token', () => {

  it('should remove auth token on logout', (done) =>{
    request(app)
      .delete('/users/me/token')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
    // delete / user / me / token
    //set x-auth equal to token
    // 200
    // find user, verify that tokens array is zero
      .end((err,res) => {
        if(err) {
          return done(err);
        }
        User.findById(users[0]._id).then((user) => {
          expect(user.tokens.length).toEqual(0);
          done();
        }).catch((e) => done(e));
      });
  });
});