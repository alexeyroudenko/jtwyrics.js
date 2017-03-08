//
//  Created by Alexey Roudenko on 23/11/16.
//  Copyright (c) 2015 Alexey Roudenko. All rights reserved.
//
//
//




// --------------------------------------------------------------
//
//
//
// array
// --------------------------------------------------------------
function Tweets(url){
	this.lyrics = new Array();
	this.request = new XMLHttpRequest();

	var that = this;
	this.request.onload = function() {
		that.parse(this.responseText);
	}

	this.request.onerror = function() {
		that.onError();
	}

	this.request.open("GET", url, true);
}

Tweets.prototype.load = function() {
	this.request.send();
}

Tweets.prototype.parse = function(text) {
	this.tweets = JSON.parse(text);
	this.onComplete();
}


//
//  CallBacks
//
Tweets.prototype.onComplete = function() {
	console.log("Tweets", "onComplete");
}

Tweets.prototype.onError = function() {
	console.log("Tweets", "onComplete");
}

Tweets.prototype.onChange = function(item) {
	console.log(item);
}
