/* app.js */

// require and instantiate express
var express = require('express');
var app = express()

var port = process.env.PORT || 8080
var bodyParser   = require('body-parser');
var session      = require('express-session');
var mongoose     = require('mongoose');
var flash        = require('connect-flash');
var configDB     = require('./config/database.js');
// configuration ===============================================================
mongoose.connect(configDB.url); // connect to our database
var passport     = require('passport')
require('./config/passport')(passport);

app.use(express.static('public'))
app.use(bodyParser());
app.use(session({ secret: 'keyboard cat' }));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash()); // use connect-flash for flash messages stored in session


/// AUTH ROUTING
app.post('/login',
  passport.authenticate('local', { successRedirect: '/',
                                   failureRedirect: '/',
                                   failureFlash: true,
                                   successFlash: 'Logged in' })
);

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});
/////


// fake posts to simulate a database
const posts = [
  {
    id: 1,
    author: 'John',
    title: 'Templating with EJS',
    body: 'Blog post number 1'
  },
  {
    id: 2,
    author: 'Drake',
    title: 'Express: Starting from the Bottom',
    body: 'Blog post number 2'
  },
  {
    id: 3,
    author: 'Emma',
    title: 'Streams',
    body: 'Blog post number 3'
  },
  {
    id: 4,
    author: 'Cody',
    title: 'Events',
    body: 'Blog post number 4'
  }
]

for (var i = 0; i <20 ; i++) {
  posts.push(posts[0])
}

// set the view engine to ejs
app.set('view engine', 'ejs')

// blog home page
app.get('/', (req, res) => {
  console.log(req.session)
  // render `home.ejs` with the list of posts
  res.render('home', { posts: posts, user: req.user, messages: req.flash() })
})

// blog post
app.get('/post/:id', (req, res) => {
  // find the post in the `posts` array
  const post = posts.filter((post) => {
    return post.id == req.params.id
  })[0]

  // render the `post.ejs` template with the post content
  res.render('post', {
    author: post.author,
    title: post.title,
    body: post.body
  })
})

app.listen(port)

console.log('listening on port ' + port)