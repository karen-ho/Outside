var Restaurant = new require('./Restaurant.js');
var fs = require('fs');

class RestaurantDao {
	getRestaurants() {
		return [
			new Restaurant('Perry\'s', 1),
			new Restaurant('Marcella\'s Lasagneria', 2)
		];
	}

	getRestaurant(id) {
		switch (id) {
			case '1':
				return JSON.parse(fs.readFileSync('restaurant/place/1.json'));
			case '2':
				return new Restaurant('Marcella\'s Lasagneria', 2);
		}
	}

	getQueries(restaurant, question) {

	}
}

module.exports = RestaurantDao;