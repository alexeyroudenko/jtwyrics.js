// --------------------------------------------------------------
//
//
//
// Twyrics
// --------------------------------------------------------------

function Twyrics(config) {
	if (config.hasOwnProperty('tweet_url') == false) {
		config.tweet_url = "http://api.proun.club/api/collections/";
	}

	if (config.hasOwnProperty('lyric_url') == false) {
		config.lyric_url = "lyrics.ass";
	}

	var target  = document.getElementById('lyrics_output');
	if (!document.getElementById("lyrics_output")) {
		console.log("create container");
		this.container = document.createElement("div");
		this.container.setAttribute("id", "lyrics_output");
		document.body.appendChild(this.container);
		document.getElementById("lyrics_output").style.zIndex = "4000";
		document.getElementById("lyrics_output").style.position = "absolute";
		document.getElementById("lyrics_output").style.fontSize = "80px";
		document.getElementById("lyrics_output").style.padding = "40px";
		document.getElementById("lyrics_output").style.margin = "40px";
		document.getElementById("lyrics_output").style.color = "white";
	}

	this.visible = true;
	this.tweets = new Tweets(config.tweet_url);
	this.lyrics = new Lyrics(config.lyric_url);
	this.karaoke = new Karaoke()

	var self = this;
	this.lyrics.onComplete = function() {
		self.tweets.load();
	}
	this.tweets.onComplete = function() {
		self.lyrics.applyTweets(self.tweets.tweets);
		self.karaoke.setupw(self.lyrics);
		self.onReady(self.lyrics);
	}
	this.tweets.onError = function() {
		self.onError();
	}
	this.lyrics.load();
}

Twyrics.prototype.onError = function(lyrics) {
	console.log("onError", lyrics);
}

Twyrics.prototype.onReady = function(lyrics) {
	console.log("onReady", lyrics);
}

Twyrics.prototype.startSimulate = function() {
	console.log("simulate");
	this.simulate = new TimeSimulator();
}

Twyrics.prototype.update = function(progress) {

	document.getElementById("lyrics_output").style.visibility = this.visible ? "visible" : "hidden";

	if (this.simulate)	{
		//console.log(this.simulate.getProgress());
		//console.log(this.karaoke);
		this.lyrics.update(progress);

	} else {
		this.lyrics.update(progress);
		// console.log(this.simulate);
	}
}

Twyrics.prototype.destroy = function() {
	this.karaoke.destroy();
}








// --------------------------------------------------------------
//
//
//
// helpers
// --------------------------------------------------------------
function TimeSimulator() {
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
