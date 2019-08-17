// This code is included as script in browser
bodjo.on('connect', socket => {
	// player has connected to server
	console.log('connected.')


	socket.on('message', function (message) {
		// this code runs after receiving new message with event name 'message'
		// you can use any other event name, instead of 'message'
		// bodjo-game uses socket.io, so api partially is the same
		console.log('received message: ', message);

		// you can run bodjo.render() to render something using received data
		// bodjo.render() will fire your code from renderer.js
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

	let timeout = 500;
	// === Controls ===
	// You can add different controls, which will be displayed under code, to:
	// - run/stop code
	// - change level/difficulty
	// - change timeout
	// - any other actions

	// Available control elements: Button, Slider, Select

	// To add controls, you should change bodjo.controls
	bodjo.controls = [
		Button('play', () => {
			// user clicked play button

			bodjo.getControl('play').setActive(true);
		}),
		Button('pause', () => {
			// user clicked pause button
		}),
		Slider('timeout', 15, 500, (value) => {
			// user selected {value} value
			// value here is an integer from 15 to 500 (inclusive)

			timeout = value;
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

	// You can take control element after your initiation to set values, like that:
	bodjo.getControl('timeout').set(250);

	// To show, that something is working, you can make buttons active:
	bodjo.getControl('play').setActive(true);

	if (false) {
		// === Storage ===
		// To save some options, that user has already set, you can use bodjo.storage
		// Actually, it saves both in cookies and localStorage

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


	if (false) {
		// === Code ===
		// Code is available in bodjo.editor.getValue()
		// To run code you can use either eval() or new Function()

		// Code should be run only when user clicks play button
		// Usually, it could be a code, that returns function, which will be used every tick

		let onTick;
		try {
			// Code in editor:
			/*  
				const CONSTANT = 3.1415927;

				function result(action) {
					return {action};
				}

				return function onTick(data) {
					return result('hello');
				}
			*/
			onTick = new Function(bodjo.editor.getValue())();
		} catch (e) {
			// Oops, we have error here!
			// You should inform user that something went wrong
			// There is a function, which will do that:
			bodjo.showError(e);
			return; // do not continue, there was an error
		}

		// So, for example, we should execute this function to answer server
		try {
			let result = onTick(data);
		} catch (e) {
			// Oops, error!
			// Do not forget to stop playing after receiving error
			bodjo.getControl('play').setActive(false);
			// Of course, it is only displayed status, stop running bot in your code

			bodjo.showError(e);
			return;
		}

		// Now we should check, that answer is correct
		// This check, of course, should be duplicated in your game server to avoid crashes
		if (typeof result !== 'object' ||
			result == null || // typeof null === 'object'
			Array.isArray(result) || // typeof [] === 'object'
			typeof result.action !== 'string') {

			// bodjo.showError() also works well with strings
			bodjo.showError('Your code returned bad response.');

			// That's over, so do not forget to stop our bot process
			return;
		}

		// Send our response to game server!
		setTimeout(() => {
			socket.emit('turn', result);
		}, timeout);
		// Make sure, that messages timeout is controlled by server or client
		// Do not allow to send messages immediately
	}
});