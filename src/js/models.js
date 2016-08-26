'use strict';

/**
 * Place model
 *
 * @param {String} location - Location
 */
function Place(location) {
	this.location = location;
	this.isActive = true;

	this._plugins = [];
}

/**
 * Connect some plugin
 *
 * @param {Object} plugin - aditional plugin
 */
Place.prototype.addPlugin = function(plugin) {
	this._plugins.push(plugin);
};

/**
 * Activate/deactivate place
 * It sends activation flag to all connected plugins
 *
 * @param {Boolean} toActivate - Activation flag
 */
Place.prototype.activate = function(toActivate) {
	this.isActive = toActivate;

	this._plugins.forEach(function(plugin) {
		plugin.activate(toActivate);
	});
};

/**
 * Imitate clicking on the model
 * Click of all connected plugins will be called.
 */
Place.prototype.click = function() {
	this._plugins.forEach(function(plugin) {
		plugin.click();
	});
};

/**
 * Place wrapper, that is used by Knockout and displayed on UI
 *
 * @param {Place} place - Place model
 */
function Item(place) {
	this.place = place;
	this.location = place.location;
}
/**
 * Handler of the knockout "click" event
 * It triggers Place's "click" method.
 *
 * @param {Item} item - Item itself
 */
Item.prototype.onClick = function(item) {
	item.place.click();
};


/**
 * Filter of places
 *
 * @param {Place[]} places - Array of places
 */
function Filter(places) {
	this._allPlaces = [];

	this.filter = ko.observable('');
	this.places = ko.observableArray([]);

	places.forEach(function(place) {
		this.addPlace(place);
	}, this);

	this.filterPlaces('.*');
}

/**
 * Add one place
 *
 * @param {Place} place - Place model
 */
Filter.prototype.addPlace = function(place) {
	this._allPlaces.push(place);
	this.places.push(place);
};

/**
 * Apply filter string
 *
 * @param {String} str - Filter value
 */
Filter.prototype.filterPlaces = function(str) {
	var pattern = new RegExp(str, 'i');

	this.places.removeAll();
	this._allPlaces.forEach(function(item) {
		var isFiltered = pattern.test(item.location);

		item.activate(isFiltered);
		if (isFiltered) {
			this.places.push(new Item(item));
		}
	}, this);
};

/**
 * Handler of "onFilter" event
 */
Filter.prototype.onFilter = function() {
	this.filterPlaces(this.filter() || '.*');
};
