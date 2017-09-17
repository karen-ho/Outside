var Intuit = require('../triggers/Intuit.js');
var MessagingService = require('../messaging/MessagingService.js');
var restaurantDao = new (require('./RestaurantDao.js'))();
var rp = require('request-promise');

class RestaurantManager {
	constructor(intuitClientId, intuitClientSecretKey, hyphenateClientId, hyphenateClientSecret, hyphenateOrg, hyphenateApp, isTest) {
		this.intuit = new Intuit(intuitClientId, intuitClientSecretKey, isTest);
		this.messagingService = new MessagingService(hyphenateClientId, hyphenateClientSecret, hyphenateOrg, hyphenateApp);
	}

	getRestaurants() {
		return restaurantDao.getRestaurants();
	}

	getRestaurant(id) {
		let restaurant = Object.assign({}, restaurantDao.getRestaurant(id));
		delete restaurant.addons;	// this is private, so remove it from this call
		return restaurant;
	}

	ask(id, message) {
		let restaurant = restaurantDao.getRestaurant(id);

		let intent = this.getIntent(restaurant, message);
		let trigger = intent.trigger;
		let answer = intent.answer;

		if (trigger) {
			switch (trigger) {
				case "createInvoice":
					let strippedMessage = message.replace(intent.query, '');
					let items = this.getItems(restaurant, strippedMessage);
					let invoice = this.createInvoice(restaurant, items);
					answer = answer.replace('${total}', invoice.total).replace('${items}', items.join(', '));
					break;
			}
		}

		this.messagingService.send(restaurant.chatroom, answer);

		return answer;
	}

	getIntent(restaurant, message) {
		let queries = restaurant.queries.filter(query => message.indexOf(query.query) !== -1);
		if (!queries || !queries.length) {
			return false;
		}

		return queries[0];
	}

	getItems(restaurant, message) {
		return message.split(',').map(s => s.trim());
	}

	createInvoice(restaurant, items) {
		this.intuit.createInvoice(restaurant.addons.intuit.realmId, restaurant.addons.intuit.authorizationCode, items);

		return {
			total: '13.46'
		};
	}
}

module.exports = RestaurantManager;