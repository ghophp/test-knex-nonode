var knex = null;

$(document).ready(function(){

	var Knex = require('knex');
	Knex.knex = Knex.initialize({
		client: 'catalog',
		connection: {
			url: '/db/'
		}
	});
	knex = Knex.knex;

	$('.find-users').click(function(){
		
		knex('users')
			.column('id', 'name', 'age')
			.select()
			.then(function(result){
				
				if(typeof result !== 'undefined') {
					for (var x = 0; x < result.length; x++) {

						var user = result[x];
						$('.users-wrapper').append(user[0] + ' ' + user[1] + ' ' + user[2] + '<br/>');
					}
				}
			});
	});
});