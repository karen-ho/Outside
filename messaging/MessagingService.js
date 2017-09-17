var rp = require('request-promise');
var baseUrl = 'http://api.hyphenate.io';

class MessagingService {
	constructor(hyphenateClientId, hyphenateClientSecret, org, appName) {
		this.hyphenateClientId = hyphenateClientId;
		this.hyphenateClientSecret = hyphenateClientSecret;
		this.org = org;
		this.appName = appName;
	}

	send(chatroomId, message, name = 'Bourdain') {
		let options = {
		    method: 'POST',
		    uri: `${baseUrl}/${this.org}/${this.appName}/token`,
		    body: {
		    	grant_type: 'client_credentials',
		    	client_id: this.hyphenateClientId,
		    	client_secret: this.hyphenateClientSecret
		    },
		    headers: {
		    	Accept: 'application/json',
		    	'Content-Type': 'application/json'
		    },
		    json: true
		};

		return rp(options)
			.then((body) => {
				let accessToken = body.access_token;
				let options = {
					method: 'POST',
				    uri: `${baseUrl}/${this.org}/${this.appName}/messages`,
					headers: {
				    	Accept: 'application/json',
				    	'Content-Type': 'application/json',
						Authorization: `Bearer ${accessToken}`
					},
					body: {
						target_type: 'chatrooms',
						target: [chatroomId],
						msg: {
							type: 'txt',
							msg: message
						},
						from: name
					},
				    json: true
				};
				return rp(options);
			});
	}
}

module.exports = MessagingService;

