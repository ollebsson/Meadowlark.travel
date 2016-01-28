var express = require('express');

var fortune = require('./lib/fortune.js');

var app = express();



var tours = [
	{ id: 0, name: 'Hood River', price: 99.99},
	{ id: 1, name: 'Oregon Coast', price: 149.95},
];
function getWeatherData() {
	return {
		locations: [
			{
				name: 'Portland',
				forecastUrl: 'http://www.wunderground.com/US/OR/Portland.html',
				iconUrl: 'http://icons-ak.wxug.com/i/c/k/cloudy.gif',
				weather: 'Overcast',
				temp: '54.1 F (12.3 C)',
			},
			{
				name: 'Bend',
				forecastUrl: 'http://icons-ak.wxug.com/i/c/k/partlycloudy.gif',
				weather: 'Partly Cloudy',
				temp: '55.0 F (12.8 C)',
			},
			{
				name:'Manzanita',
				forecastUrl: 'http://www.wunderground.com/US/OR/Manzanita.html',
				iconUrl: 'http://icons-ak.wxug.com/i/c/k/rain.gif',
				weather: 'Light rain',
				temp: '55.0 F (12.8 C)',
			}
		]
	};
}
var handlebars = require('express3-handlebars')
		.create({ defaultLayout: 'main',
			helpers: {
				section: function(name, options) {
					if(!this._sections) this._sections = {};
					this._sections[name] = options.fn(this);
					return null;
				}
			}});
app.engine('handlebars', handlebars.engine);

app.set('view engine', 'handlebars');

app.set('port', process.env.PORT || 3000);

// Adding middleware for serving static files such as css, img etc.
app.use(express.static(__dirname + '/public'));

app.use(function(req, res, next) {
	if(!res.locals.partials) res.locals.partials = {};
	res.locals.partials.weahter = getWeatherData();
	next();
});
// add routes
app.get('/', function(req, res) {
	res.render('home');
});
app.get('/about', function(req, res) {
	res.render('about') //, { fortune: fortune.getFortune() } );

});

app.get('/foo', function(req, res) {
	res.render('foo', { layout: null});
});
app.get('/nursery-rhyme', function(req, res) {
	res.render('nursery-rhyme');
});
app.get('/data/nursery-rhyme', function(req, res) {
	res.json({
		animal: 'squirrel',
		bodyPart: 'tail',
		adjective: 'bushy',
		noun: 'heck',
	});
});
/*app.get('/error', function(req, res) {
	res.status(500).render('error'); //Chaining two methods here, same as
	//res.status(500);
	//res.render('error');
});
*/
/*app.get('/greeting', function(req, res) {
	res.render('about', {
		message: 'welcome',
		style: req.query.style,
		userid: req.cookie.userid,
		username: req.session.username,
	});
});*/

app.get('/no-layout', function(req, res) {
	res.render('no-layout', { layout: null});
});

app.get('/custom-layout', function(req, res) {
	res.render('custom-layout', { layout: 'custom'});
});
app.get('/test', function(req, res) {
	res.type('text/plain');
	res.send('This is a test!');
});

app.get('/api/tours', function(req, res) {
	res.json(tours);
});


app.use(function(err, req, res, next) {
	console.error(err.stack);
	res.status(500).render('error');
});
// custom 404 page handler
app.use(function(req, res, next){
	res.status(404);
	res.render('404');
});

// cutom 500 page



app.listen(app.get('port'), function() {
	console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate');
})