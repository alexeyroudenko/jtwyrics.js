//
//  Created by Alexey Roudenko on 23/11/16.
//  Copyright (c) 2015 Alexey Roudenko. All rights reserved.
//
//
//

MAX_TWEET_PER_WORD = 3;

// --------------------------------------------------------------
//
//
//
// item
// --------------------------------------------------------------
function LyricsItem(start, end, string) {
	this.itemId = -1;
	this.state = "forward"; //forward, active, finish
	this.start = this.parseTime(start);
	this.end = this.parseTime(end);
	this.string = string;
	this.tweets = new Array();
	this.changed = true;
}

LyricsItem.prototype.parseTime = function(time) {
	var a = time.split(':');
	var seconds = (+a[0]) * 60 * 60 + (+a[1]) * 60 + (+a[2]);
	return seconds
}

LyricsItem.prototype.activate = function(time) {
	this.state = "active";
	this.changed = true;
}

LyricsItem.prototype.isCurrent = function(time) {return this.state == "active";}

LyricsItem.prototype.checkIsForward = function(time) {return time < this.start;}

LyricsItem.prototype.checkIsFinish = function(time) {return time > this.end;}

LyricsItem.prototype.checkIsCurrent = function(time) {return time > this.start && time < this.end;}

LyricsItem.prototype.update = function(time) {

	if (this.checkIsForward(time) && this.state != "forward") {
		this.state = "forward";
		this.changed = true;
		console.log("forward");
		return true;
	}

	if (this.checkIsFinish(time) && this.state != "finish") {
		this.state = "finish";
		this.changed = true;

		var element = document;
		var event = document.createEvent("CustomEvent");
		event.initCustomEvent("DeactivationEvent", true, true, {'item':this});
		element.dispatchEvent(event);
		// console.log("DeactivationEvent");
		return true;
	}

	if (this.checkIsCurrent(time) && this.state != "active") {
		this.state = "active";
		this.changed = true;

		var element = document;
		var event = document.createEvent("CustomEvent");
		event.initCustomEvent("ActivationEvent", true, true, {'item':this});
		element.dispatchEvent(event);
		// console.log("ActivationEvent");
		return true;
	}
	this.changed = false;
}













// --------------------------------------------------------------
//
//
//
// array
// --------------------------------------------------------------
function Lyrics(url){
	this.lyrics = new Array();
	this.request = new XMLHttpRequest();
	this.request.open("GET", url, true);
	var that = this;
	this.request.onload = function() {
		that.parse(this.responseText);
	}
	this.changed = true;
}

Lyrics.prototype.load = function() {
	this.request.send();
}

Lyrics.prototype.parse = function(text) {
	var lines = text.split("\n");
	var index = 0;
	for(i in lines) {
		var line = lines[i].split(',');
		if (line[0].indexOf("Dialogue") == 0) {
			var start = line[1];
			var end = line[2];
			var string = line[9];
			var item = new LyricsItem(start, end, string);
			var that = this;
			item.itemId = index;
			this.lyrics.push(item);
			index++;
		}
	}
	this.changed = true;
	this.onComplete();
}

Lyrics.prototype.notify = function(e) {
	console.log(e);
	//var event = new CustomEvent('activate', {'item': this});
}


Lyrics.prototype.update = function(time) {
	//console.log(e);
	this.changed = false;
	for(i in this.lyrics) {
		var item = this.lyrics[i];
		var changed = item.update(time);
		if (changed) {
			this.onChange(item);
			this.changed = true;
		}
	}
}

Lyrics.prototype.formatted = function() {
	var string = "";
	for(i in this.lyrics) {
		if (this.lyrics[i].state == 'active') string += "<span class='active'>"
		string += '<a href="#' + this.lyrics[i].itemId + '" onclick="showTweet(' + this.lyrics[i].itemId + ')">' + this.lyrics[i].string + '</a>';
		if (this.lyrics[i].state == 'active') string += "</span>"
		string += "<br>";
	}
	return string;
}

Lyrics.prototype.formattedActiveTweets = function() {
	var string = "";
	for(i in this.lyrics) {
		if (this.lyrics[i].state == 'active') {
			for(j in this.lyrics[i].tweets) {
				var tweet = this.lyrics[i].tweets[j];
				string += tweet['tweet_author'] + "<br>";
				string += tweet['tweet_content'] + "<br>";
				string += tweet['tweet_hashtags'] + "<br>";
				string += tweet['tweet_time'] + "<br>";
				string += tweet['tweet_url'] + "<br>";
			}
		}
	}
	return string;
}

Lyrics.prototype.getNearest = function() {
	var string = "";
	var type = 0;
	for(i in this.lyrics) {
		if (type == 0 && this.lyrics[i].state == 'forward') {
			string = this.lyrics[i].string;
			type = 1;
		}
		if (type == 0 && this.lyrics[i].state == 'active') {
			string = this.lyrics[i].string;
			type = 1;
		}
	}
	return string;
}

Lyrics.prototype.formattedTweets = function(lyricsId) {
	var string = "";
	for(i in this.lyrics) {
		if (this.lyrics[i].itemId == lyricsId) {
			for(j in this.lyrics[i].tweets) {
				var tweet = this.lyrics[i].tweets[j];
				string += tweet['tweet_time'] + "&nbsp;";
				string += tweet['tweet_author'] + "<br>";
				string += tweet['tweet_content'] + "<br>";
				string += tweet['tweet_hashtags'] + "<br>";

				// string += tweet['tweet_url'] + "<br>";
			}
		}
	}
	return string;
}




Lyrics.prototype.applyTweets = function(tweets) {
	//console.log("Lyrics", "applyTweets", this.lyrics);
	var index = 0;
	for(i in tweets['recent']) {
		var tweet = tweets['recent'][i];
		for(j in this.lyrics) {
			var item = this.lyrics[j];
			if (item.string.indexOf(tweet.word) != -1) {
				tweet.tweetId = tweet['tweet_timestamp'];
				if (item.tweets.length < MAX_TWEET_PER_WORD) {
					item.tweets.push(tweet);
					tweet.localId = index;
					index++;
				}
				//console.log("Lyrics", "added", tweet, "to", item);
			}
		}
	}
}





//
//  CallBacks
//
Lyrics.prototype.onComplete = function() {
	console.log("Lyrics", "onComplete");
}

Lyrics.prototype.onChange = function(item) {
	//console.log(item);
}

Lyrics.prototype.onError = function() {
	console.log("Lyrics", "onError");
}
