var knex = null;

$(document).ready(function(){

	var Knex = require('knex');
	var Bookshelf = require('bookshelf');

	var Endpoint = Bookshelf.initialize({
		client: 'catalog',
		connection: {
			url: '/db/'
		}
	});

	var User = Endpoint.Model.extend({
		tableName: 'users'
	});

	new User({'name': 'Guilherme Oliveira'})
		.fetch()
		.then(function(model) {
			console.log(model);
		});
});