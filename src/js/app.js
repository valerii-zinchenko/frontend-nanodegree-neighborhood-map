'use strict';

var runtimeDB = [];

// convert pure DB data into models
puredb.forEach(function(item){
	var model = new Place(item);

	runtimeDB.push(model);
});

// set up filter
var filter = new Filter(runtimeDB);
ko.applyBindings(filter);


// attach few DOM events
var navigation = document.getElementById('navigation');
var menu = document.getElementById('menu');
menu.addEventListener('click', function(ev) {
	ev.stopPropagation();

	this.classList.toggle('open');
	navigation.classList.toggle('open');
});

document.getElementById('places').addEventListener('click', function(ev) {
	menu.classList.remove('open');
	navigation.classList.remove('open');
});


window.addEventListener('load', function() {
	var mapEl = document.getElementById('map');

	// this is the only place where the app will or will not work with Google Maps
	if (window.google) {
		new Map(mapEl, runtimeDB, Wiki);
	} else {
		mapEl.innerHTML = 'Sorry, Google Map is not reachable for now. Please check your internet connection.';
	}
});

