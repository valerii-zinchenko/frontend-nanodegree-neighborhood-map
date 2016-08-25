'use strict';

var runtimeDB = [];

puredb.forEach(function(item){
	var model = new Place(item);

	runtimeDB.push(model);
});

var filter = new Filter(runtimeDB);
ko.applyBindings(filter);


var navigation = document.getElementById('navigation');
var menu = document.getElementById('menu');
menu.addEventListener('click', function(ev) {
	if (ev) {
		ev.stopPropagation();
	}

	this.classList.toggle('open');
	navigation.classList.toggle('open');
});

document.getElementById('places').addEventListener('click', function(ev) {
	menu.classList.remove('open');
	navigation.classList.remove('open');
});


window.addEventListener('load', function() {
	var mapEl = document.getElementById('map');
	if (window.google) {
		new Map(mapEl, runtimeDB, Wiki);
	} else {
		mapEl.innerHTML = 'Sorry, Google Maps are currecntly not available. Please try later.';
	}
});

