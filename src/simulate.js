


function TimeSimulator(time) {
    if (time == 'undefined') time = 0;
	var date = new Date();
	this.startTime = date.getTime() - time * 1000.0;
}

TimeSimulator.prototype.start = function (time) {
    if (time == 'undefined') time = 0;
	var date = new Date();
	this.startTime = date.getTime() - time * 1000.0;	
}

TimeSimulator.prototype.getProgress = function() {
	var date = new Date();
	return (0.00001 * (date.getTime() - this.startTime)).toFixed(2);
}

TimeSimulator.prototype.getTime = function() {
	var date = new Date();
	return (0.001 * (date.getTime() - this.startTime)).toFixed(2);
}