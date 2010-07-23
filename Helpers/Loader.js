(function(){

var toString = Object.prototype.toString;
var isArray = Array.isArray || function(array){
	return toString.call(array) == '[object Array]';
};

var forEach = function(array, fn, bind){
	for (var i = 0, l = array.length; i < l; i++){
		if (i in array) fn.call(bind, array[i], i, array);
	}
};

// Uses String.parseQueryString from MooTools-More
// TODO Needs compat for other browsers
var parseQueryString = function(string){
	var vars = string.split(/[&;]/), res = {};
	if (vars.length) forEach(vars, function(val){
		var index = val.indexOf('='),
			keys = index < 0 ? [''] : val.substr(0, index).match(/[^\]\[]+/g),
			value = decodeURIComponent(val.substr(index + 1)),
			obj = res;
		forEach(keys, function(key, i){
			var current = obj[key];
			if(i < keys.length - 1)
				obj = obj[key] = current || {};
			else if(current && isArray(current))
				current.push(value);
			else
				obj[key] = current != null ? [current, value] : value;
		});
	});
	return res;
};

var getSpecs = function(queryString){
	queryString = parseQueryString(queryString);

	var requestedSpecs = [],
		specs = queryString.specs;

	forEach(specs && isArray(specs) ? specs : [specs], function(spec){
		if (Sets[spec] && requestedSpecs.indexOf(spec) == -1) requestedSpecs.push(spec);
	});

	return requestedSpecs;
};

this.loadLibrary = function(Source, queryString){
	var query = parseQueryString(queryString),
		version = query.version,
		path = query.path || '../Source/',
		types = query.types || [],
		source = Source[version];
	
	if (!source) return;

	if (!types.length) for (var type in source) types.push(type);

	for (var i = 0; i < types.length; i++)
		if (source[types[i]])
			load(source[types[i]], path);

};

this.loadSpecs = function(Sets, queryString){
	var requestedSpecs = getSpecs(queryString);
	for (var i = 0; i < requestedSpecs.length; i++){
		var specs = Sets[requestedSpecs[i]];
		load(specs, requestedSpecs[i] + '/');
	}

	return requestedSpecs;
};

})();