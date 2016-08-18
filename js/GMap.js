'use strict';

/**
 * Class that responsible for map and interactions with it
 *
 * @constructor
 * @param {Object} element - DOM element, where the map will be rendered
 * @param {String[]} places - an array of places to render
 * @param {Function} [additionalPlugin] - function for getting additional info about the marked place
 */
var Map = function(element, places, additionalPlugin) {
	this._map = new google.maps.Map(element);
	this._mapBounds = new google.maps.LatLngBounds();
	this._infoWindow = new google.maps.InfoWindow();
	this._service = new google.maps.places.PlacesService(this._map);

	if (additionalPlugin) {
		this._additionalPlugin = additionalPlugin;
	}

	var _this = this;
	window.addEventListener('resize', function() {
		_this._map.fitBounds(_this._mapBounds);
	});

	this.markPlaces(places);
};

/**
 * Google map
 */
Map.prototype._map = null;
/**
 * Google map bounds
 */
Map.prototype._mapBounds = null;
/**
 * Abstract method for getting more detailed information about the marker
 */
Map.prototype._additionalPlugin = function(){};

/**
 * Mark places on the Google map
 *
 * @param {String[]} places - an array of strings/places
 */
Map.prototype.markPlaces = function(places) {
	var _this = this;

	places.forEach(function(place) {
		_this._service.textSearch({query: place.location}, function(results, status) {
			if (status === google.maps.places.PlacesServiceStatus.OK) {
				_this.createMapMarker(place, results[0]);
			}
		});
	});
};

/**
 * Create a marker on the map from the searching result
 *
 * @param {Place} place - searched place
 * @param {Object} placeData - data object about the searched place
 */
Map.prototype.createMapMarker = function(place, placeData) {
	var lat = placeData.geometry.location.lat();	// latitude from the place service
	var lon = placeData.geometry.location.lng();	// longitude from the place service

	var markerPlugin = new MarkerPlugin(placeData, this._map);
	place.addPlugin(markerPlugin);

	this._mapBounds.extend(new google.maps.LatLng(lat, lon));
	// fit the map to the new marker
	this._map.fitBounds(this._mapBounds);
	// center the map
	this._map.setCenter(this._mapBounds.getCenter());

	var _this = this;
	var marker = markerPlugin.marker;
	google.maps.event.addListener(marker, 'click', function() {
		if (!place.isActive) {
			return;
		}

		new _this._additionalPlugin(place.location, function(info) {
			_this._infoWindow.setContent(info);
			_this._infoWindow.open(_this._map, marker);
		});

		// take care of animation interference
		if (!marker.getAnimation()) {
			// start marker bouncing
			marker.setAnimation(google.maps.Animation.BOUNCE);

			// stop marker bouncong after at the 3rd jump
			setTimeout(function(){
				marker.setAnimation(null);
			}, 700*3);
		}
	});
};

function MarkerPlugin(placeData, map) {
	this.marker = new google.maps.Marker({
		map: map,
		position: placeData.geometry.location,
		title: placeData.formatted_address
	});
}

MarkerPlugin.prototype.activate = function(toActivate) {
	this.marker.setIcon(
		toActivate
			? 'http://maps.gstatic.com/mapfiles/api-3/images/spotlight-poi.png'
			: 'http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|555'
	);
};
