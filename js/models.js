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

Place.prototype.click = function() {
	this._plugins.forEach(function(plugin) {
		plugin.click();
	});
};

function Item(place) {
	this.place = place;
	this.location = place.location;
}
Item.prototype.onClick = function(item) {
	item.place.click();
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
	var pattern = new RegExp(strPattern, 'i');

	this.places.removeAll();
	this._allPlaces.forEach(function(item) {
		var isFiltered = pattern.test(item.location);

		item.activate(isFiltered);
		if (isFiltered) {
			this.places.push(new Item(item));
		}
	}, this);
};

Filter.prototype.onFilter = function() {
	this.filterPlaces(this.filter() || '.*');
};
