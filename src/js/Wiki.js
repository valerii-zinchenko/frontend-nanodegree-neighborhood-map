'use strict';

/**
 * Wikipedia API
 *
 * @param {String} text - Searching query
 * @param {Function} callback - Callback function that will be triggered
 */
var Wiki = function(text, callback) {
	if (!text) {
		return;
	}

	// Use cached data if they exist
	if (Wiki._wiki_cache[text]) {
		callback(this._formatRS(Wiki._wiki_cache[text]));
		return;
	}

	var _this = this;
	$.ajax({
		url: 'https://en.wikipedia.org/w/api.php',
		data: { action: 'opensearch', search: text, format: 'json'},
		dataType: 'jsonp',
		success: function (rs) {
			if (rs.length === 0) {
				callback('Nothing waws found in Wikipedia');
			}

			// cache successful response
			Wiki._wiki_cache[text] = rs;

			callback(_this._formatRS(Wiki._wiki_cache[text]));
		},
		error: function() {
			callback('Sorry, <a href="https://en.wikipedia.org/wiki">Wikipedia</a> is not reachable for some reason now. Please check your conection or try later');
		}
	});
};

/**
 * Cache to redice the amount of the identical requests
 *
 * @type {Object}
 */
Wiki._wiki_cache = {};

/**
 * Process successful response
 *
 * @returns {String}
 */
Wiki.prototype._formatRS = function(rs) {
	var html = '<h3><a href="' + rs[3] + '" target="_blank">' + rs[0] + '</a></h3>';

	// rs[2] contains an array or descriptions
	// sometimes there is no descriptions, it leads to the situation --> rs[2] = [""]
	if (rs[2].length > 0 && rs[2][0]) {
		rs[2].forEach(function(item) {
			html += '<p>' + item + '</p>';
		});
	} else {
		html += '<p>Sorry, no description is provided from Wikipedia</p>';
	}

	return html;
};
