var express = require('express');
var methodOverride = require('method-override')
var app = express()

var exphbs = require('express-handlebars');

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

//mongoose dabase acess
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/rotten-potatoes');

var Reviews = mongoose.model('Review',{
    title:String,
    description: String,
    movieTitle: String
});

app.listen(3000, function () {
  console.log('Portfolio App listening on port 3000!')
})

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

// override with POST having ?_method=DELETE or ?_method=PUT
app.use(methodOverride('_method'));

app.get('/',function(req,res){
    Reviews.find(function(err,reviews){
        res.render('reviews-index', {reviews:reviews})
    })
});

app.post('/reviews', function (req, res) {
  Reviews.create(req.body, function(err, review) {
    res.redirect('/reviews/' + review._id);
  })
});

app.get('/reviews/new',function(req,res){
    res.render('reviews-new', {});
});

app.get('/reviews/:id', function (req, res) {
    Reviews.findById(req.params.id).exec(function(err, review){
             res.render('reviews-show', {review: review});
    })
});
app.put('/reviews/:id', function (req, res) {
  Reviews.findByIdAndUpdate(req.params.id,  req.body, function(err, review) {
    res.redirect('/reviews/' + review._id);
  })
});

app.delete('/reviews/:id', function (req, res) {
    Reviews.findByIdAndRemove({_id: req.params.id}, function(err) {
        res.redirect('/');
    })
})
app.get('/reviews/:id/edit', function (req, res) {
  Reviews.findById(req.params.id, function(err, review) {
    res.render('reviews-edit', {review: review, ID: req.params.id});
  })
});
//app.get('/',function(req,res){
//    res.render('home', {msg: 'Hello World'});
//})
