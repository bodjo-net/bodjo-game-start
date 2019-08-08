// This code runs only one time, at start
// So here you can download all your assets, you need
// For example, you can put image to web/assets/sprite.png
// 	and then use it:
let image = new Image();
image.src = 'assets/sprite.png';
//image.onload = ...

bodjo.on('render', (data) => {
	// this code runs after:
	//	- bodjo.render(...data);
	//  - window resize
	//  - workspace resize (left section of web page)

	// if bodjo.render(...data) has never been run, then data will be null
	// but, bodjo will remember data and will execute your render method with it when resizing window
	// Like that:
	//  - window resize => data = null
	//  - bodjo.render([1,2,3]) => data = [1,2,3]
	//  - window resize => data = [1,2,3]

	// You can change aspect ratio of your canvas by executing:
	//   resizeCanvas(your_width / your_height);
	// resizeCanvas is global function
	// But, we don't recommend to resize canvas every tick, so check if canvas should be resized
	// You can take actual aspect ratio in aspectRatio global variable
	//
	// So, finally, your code to change aspect ratio of canvas:
	let width = 1, height = 1;
	if (aspectRatio != (width / height))
		resizeCanvas(width / height) 

	// you can take canvas and 2d context (ctx), they are in global scope
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.beginPath();
	ctx.arc(canvas.width/2,
			canvas.height/2,
			Math.min(canvas.width, canvas.height) * 0.25,
			0, Math.PI*2);
	ctx.fillStyle = 'red';
	ctx.fill();
	// it just draws red circle, nothing special :)

	// you can take even webgl context, but it hasn't tested yet by me

	// Good luck! :)
});