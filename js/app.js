'use strict';

window.addEventListener('load', function() {
	var runtimeDB = [];

	puredb.forEach(function(item){
		var model = new Place(item);

		runtimeDB.push(model);
	});

	var filter = new Filter(runtimeDB);
	ko.applyBindings(filter);

	var mapEl = document.getElementById('map');
	if (window.google) {
		new Map(mapEl, runtimeDB, Wiki);
	} else {
		mapEl.innerHTML = 'Sorry, Google Maps are currecntly not available. Please try later.';
	}
});

