//
//  Created by Alexey Roudenko on 23/11/16.
//  Copyright (c) 2016 Alexey Roudenko. All rights reserved.
//

function Karaoke() {
	this.active = true;
}

Karaoke.prototype.setupw = function(lyrics) {
	this.lyrics = lyrics;

	var that = this;
	var element = document;
	element.addEventListener('ActivationEvent', function (e) {
		if (that.active == true) that.showText(e.detail.item);
		//console.log("[Karaoke]", "ActivationEvent");
	}, false);

	element.addEventListener('DeactivationEvent', function (e) {
		if (that.active == true) that.hideText(e.detail.item);
		//console.log("[Karaoke]", "DeactivationEvent");
	}, false);
}

function anim(x) {
   $('#lyrics_output').removeClass().addClass(x + ' animated').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
	 	$(this).removeClass();
   });
 };

Karaoke.prototype.showText = function(item) {
	document.getElementById("lyrics_output").innerHTML = item.string;
	//anim("flipInX");
}

Karaoke.prototype.hideText = function(item) {
	document.getElementById("lyrics_output").innerHTML = "";
}


// --------------------------------------------------------------
//
//
// update
// --------------------------------------------------------------
Karaoke.prototype.update = function() {}

Karaoke.prototype.destroy = function() {
	document.getElementById("lyrics_output").innerHTML = "";
	this.active = false;
}
