exports.formatTime = function(time){
	return time.toLocaleDateString() 
		+ ' '
		+ time.toTimeString().replace(/\sGM.*$/, '');
	console.log("formatTime方法执行。。。");
}