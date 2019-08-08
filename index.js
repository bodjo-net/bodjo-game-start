/*
	This code of your game server.
	Here you should write logic of your game.
	Documentation: http://pages.bodjo.net/#docs.game.start.ru

	Made with <3
*/

let BodjoGame = require('@dkaraush/bodjo-game');
let bodjo = new BodjoGame(promptConfig('config.json'));

bodjo.initClient('./web/'); // directory with client-side scripts and assets

bodjo.on('connect', (player) => {
	let username = player.username;
	console.log(username + ' has connected');

	player.emit('message', 'Hello, world!');

	player.on('disconnect', () => {
		console.log(username + ' has disconnected');
	});


	if (false) {
		// === Scoreboard ===
		// You can push new score data of your player by doing this:
		bodjo.scoreboard.push(username, 0)
		// You can also save some more data to show them on scoreboard table
		bodjo.scoreboard.push(username, {kills: 10, score: 100});

		// To get score data, use get() method:
		bodjo.scoreboard.get(username);
		// If there is no data, it will return undefined
		// So, on connect, you can obtain player with zero values, like that:
		if (typeof bodjo.scoreboard.get(username) === 'undefined')
			bodjo.scoreboard.push(username, {kills: 0, score: 0});

		// Also, you should check if score data is less than new one, to not make player lose his/her score
		if (typeof bodjo.scoreboard.get(username) < newScore)
			bodjo.scoreboard.push(username, newScore);
	}
});

bodjo.start();