var express = require('express');

var app = express();

var handlebars = require('express3-handlebars')
		.create({ defaultLayout: 'main'});
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

var fortunes = [
	"Congquer your fears or they will conquer you.",
	"Rivers need springs.",
	"Do not fear what you don't know.",
	"You will always have a pleasant surprise",
	"Whenever possible, keep it simple"
];

app.set('port', process.env.PORT || 3000);

// Adding middleware for serving static files such as css, img etc.
app.use(express.static(__dirname + '/public'));
// add routes
app.get('/', function(req, res) {
	res.render('home');
});
app.get('/about', function(req, res) {
	var randomFortune = fortunes[Math.floor(Math.random() * fortunes.length)];
	res.render('about', {fortune: randomFortune});

});

// custom 404 page handler
app.use(function(req, res, next){
	res.status(404);
	res.render('404');
});

// cutom 500 page
app.use(function(err, req, res, next) {
	console.error(err.stack);
	res.status(500);
	res.render('500')
});

app.listen(app.get('port'), function() {
	console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate');
})