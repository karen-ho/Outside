var rp = require('request-promise');

class Intuit {
	constructor(clientId, clientSecretKey, isTest) {
		this.clientId = clientId;
		this.clientSecretKey = clientSecretKey;
		this.baseUrl = isTest ? 'https://sandbox-quickbooks.api.intuit.com' : 'https://quickbooks.api.intuit.com';
		this.isTest = isTest;
	}

	createInvoice(realmId, authorizationToken, lines) {
		validateItems(realmId, authorizationToken, lines);

		let invoice = {
		  "Line": [
		    {
		      "Amount": 19.95,
		      "DetailType": "SalesItemLineDetail",
		      "SalesItemLineDetail": {
		        "ItemRef": {
		          "value": "19",
		          "name": "Lasagna"
		        }
		      }
		    }
		  ],
		  "CustomerRef": {
		    "value": "1"
		  }
		};

		let options = {
			method: 'POST',
			uri: `${this.baseUrl}/v3/company/${realmId}/`,
			headers: {
		    	Accept: 'application/json',
		    	'Content-Type': 'application/json',
				Authorization: `Bearer ${authorizationToken}`
			},
			body: invoice,
			json: true
		};

		return rp(options);
	}

	validateItems(realmId, authorizationToken, lines) {
		if (isTest) {
			return [{
	          "value": "19",
	          "name": "Lasagna"
	        }];
	    }

	    let query = 'SELECT * FROM Item';

		let options = {
			method: 'POST',
			uri: `${this.baseUrl}/v3/company/${realmId}/query?query=${query}`,
			headers: {
		    	Accept: 'application/json',
		    	'Content-Type': 'application/json',
				Authorization: `Bearer ${authorizationToken}`
			},
			body: invoice,
			json: true
		};

		return rp(options);
	}
}

module.exports = Intuit;