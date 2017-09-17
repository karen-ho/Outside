var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var restaurantManager = new (require('./restaurant/RestaurantManager.js'))(
	process.env.INTUIT_CLIENT_ID,
	process.env.INTUIT_CLIENT_SECRET_KEY,
	process.env.HYPHENATE_CLIENT_ID,
	process.env.HYPHENATE_CLIENT_SECRET,
	process.env.HYPHENATE_ORG,
	process.env.HYPHENATE_APP_NAME,
	(process.env.IS_TEST || '').toLowerCase() === 'true');
var messagingService = new (require('./messaging/MessagingService.js'))(
	process.env.HYPHENATE_CLIENT_ID,
	process.env.HYPHENATE_CLIENT_SECRET,
	process.env.HYPHENATE_ORG,
	process.env.HYPHENATE_APP_NAME);

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/restaurants', function(request, response) {
	response.json(restaurantManager.getRestaurants());
});

app.get('/restaurants/:restaurantId', function(request, response) {
	let restaurantId = request.params.restaurantId;
	response.json(restaurantManager.getRestaurant(restaurantId));
});

app.post('/restaurants/:restaurantId', function(request, response) {
	let message = (request.body || {}).message;
	if (!message) {
		response.json({});
	}

	let restaurantId = request.params.restaurantId;
	response.json(restaurantManager.ask(restaurantId, message));
});

app.get('/reset', function(request, response) {
	let roomId = '27520287178753';
	let messages = [
		{message: 'Is it noisy?', person: 'carl'},
		{message: 'No live bands or music. Sorry ladies, no karoake tuesday\'s.'},
		{message: 'What is the dress code?', person: 'carl'},
		{message: 'It is business casual, like Cali casual with American (New) food.', person: 'annie'},
		{message: 'thanks, I\'ll definitely hit this place up with my pals after work then', person: 'carl'},
		{message: 'I haven\'t been back to this restaurants for years. Has it changed?', person: 'rachel'},
		{message: 'It is smaller, more plush, more intimate, and less hectic than the previous iterations of this restaurant.', person: 'sam'},
		{message: 'The table layout is pretty much the same, but they added in an open balcony seating area.', person: 'annie'},
		{message: 'Is this a good date-spot for the first date?', person: 'tim'},
		{message: 'Business casual wear and not too loud, so sounds perfect to me'}
	];

	let interval = setInterval(() => {
		let message = messages.shift();
		if (!message) {
			clearInterval(interval);
			response.json(true)
			return;
		}
		messagingService.send(roomId, message.message, message.person || 'bourdain');
	}, 500);
});

app.get('/', function(request, response) {
  response.render('pages/index');
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});