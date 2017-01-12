


function TimeSimulator() {
	var date = new Date();
	this.startTime = date.getTime();
}

TimeSimulator.prototype.start = function () {
	var date = new Date();
	this.startTime = date.getTime();	
}

TimeSimulator.prototype.getProgress = function() {
	var date = new Date();
	return (0.00001 * (date.getTime() - this.startTime)).toFixed(2);
}

TimeSimulator.prototype.getTime = function() {
	var date = new Date();
	return (0.001 * (date.getTime() - this.startTime)).toFixed(2);
}