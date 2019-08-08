// This code is included as script in browser
bodjo.on('connect', socket => {
	// player has connected to server
	console.log('connected.')

	// you can run bodjo.render() to render something using received data
	// bodjo.render() will fire your code from renderer.js

	socket.on('message', function (message) {
		// this code runs after receiving new message
		// you can use any other event name, instead of 'message'
		// bodjo-game uses socket.io, so api partially the same
		console.log('received message: ', message);
	});

	socket.on('disconnect', function () {
		console.log('disconnected.');
	});

	// === Scoreboard ===
	socket.on('scoreboard', (scoreboard) => {
		// Scoreboard here is an array with objects, like:
		// [{username: 'dkaraush', value: 20, place: 1}, {username: 'test', value: 10, place: 2}]

		// If your server saves more than one variable, than object will be assigned with username and place
		// Example:
		// In your server (index.js): bodjo.scoreboard.push('dkaraush', {kills: 10, score: 100});
		// Client will receive: [{username: 'dkaraush', place: 1, kills: 10, score: 100}]

		// You can show scoreboard data in table, using bodjo.renderScoreboard(headers, data)
		bodjo.renderScoreboard(['Place', 'Username', 'Kills', 'Score'], 
							   scoreboard.map(player => [
							   		'<b>'+player.place+'</b>', // here could be html
							   		Player(player.username),
							   		player.kills,
							   		player.score
							   ])
		);

		// Note, that here we used Player(username) method
		// It will load player's icon image and return html of player
	});


	// === Controls ===
	// You can add different controls, which will display under code, to:
	// - run/stop code
	// - change level/difficulty
	// - change timeout
	// - any other reasons

	// Available control elements: Button, Slider, Select

	// To add controls, you should change bodjo.controls
	bodjo.controls = [
		Button('play', () => {
			// user clicked play button
		}),
		Button('pause', () => {
			// user clicked pause button
		}),
		Slider('timeout', 0, 100, (value) => {
			// user selected {value} value
			// value here is an integer from 0 to 100 (inclusive)
		}),
		Select('difficulty', [
			'Beginner',
			'Intermediate',
			'Expert'
		], (level) => {
			// user selected {level} level
			// level here is an integer from 0 to 2
		})
	];
	// First string in each control constructor should be unique.
	// If you want to add own button with own icon, put icon to:
	//  web/ui/{control-id}.png
	// Available icons: play, pause, replay, timeout, difficulty

	// You can take control element after your inition to set values, like that:
	bodjo.getControl('timeout').set(250);

	// To show, that something is working, you can make buttons be active:
	bodjo.getControl('play').setActive(true);


	if (false) {
		// === Storage ===
		// To save some options, that user has already set, you can use bodjo.storage
		// Actually it saves both in cookies and localStorage

		// Examples:
		bodjo.storage.set('key-string', 'value');
		bodjo.storage.set('key-number', 10);
		bodjo.storage.set('key-object', {key: 'value'});

		bodjo.storage.get('key-number'); // 10

		// You can specify in which game/server data should be saved.
		// There are two global variables, which are loaded from your config.json (which you have prompted before)
		// GAME_NAME (ex. "minesweeper"), GAME_SERVER (ex. "minesweeper-global1")
		bodjo.storage.set('timeout-'+GAME_NAME, 500); // it will save in timeout-minesweeper and will not touch other games
	}
});