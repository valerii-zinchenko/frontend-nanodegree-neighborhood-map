'use strict';

function Place(location) {
	this.location = location;
	this.isActive = true;

	this._plugins = [];
}

Place.prototype.addPlugin = function(plugin) {
	this._plugins.push(plugin);
};

Place.prototype.activate = function(toActivate) {
	this.isActive = toActivate;

	this._plugins.forEach(function(plugin) {
		plugin.activate(toActivate);
	});
};


function Filter(places) {
	this._allPlaces = [];

	this.filter = ko.observable('');
	this.places = ko.observableArray([]);

	places.forEach(function(place) {
		this.addPlace(place);
	}, this);

	this.filterPlaces('.*');
}

Filter.prototype.addPlace = function(place) {
	this._allPlaces.push(place);
	this.places.push(place);
};

Filter.prototype.filterPlaces = function(strPattern) {
	var pattern = new RegExp(strPattern);

	this.places.removeAll();
	this._allPlaces.forEach(function(item) {
		var isFiltered = pattern.test(item.location);

		item.activate(isFiltered);
		if (isFiltered) {
			this.places.push({place: item.location});
		}
	}, this);
};

Filter.prototype.onFilter = function() {
	this.filterPlaces(this.filter() || '.*');
};
