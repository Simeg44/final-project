
var denverArea = {
	bounds: new google.maps.LatLngBounds(
		new google.maps.LatLng(39.400877, -105.604163),
		new google.maps.LatLng(40.686324, -104.557436)
	)
};

// City zones for circle overlays and kakoi distribution
var citymap = {
	"boulder": {
		center: new google.maps.LatLng(40.024603, -105.254139),
		population: 103166,
		coor: [40.024603, -105.254139]
	},
	"longmont": {
		center: new google.maps.LatLng(40.178335, -105.102477),
		population: 89919,
		coor: [40.178335, -105.102477]
	},
	"louisville": {
		center: new google.maps.LatLng(39.973643, -105.148836),
		population: 40000, // not population
		coor: [39.973643, -105.148836]
	},
	"lafayette": {
		center: new google.maps.LatLng(39.995619, -105.091319),
		population: 26784,
		coor: [39.995619, -105.091319]
	},
	"denver": {
		center: new google.maps.LatLng(39.746365, -104.987097),
		population: 1649495, // not population
		coor: [39.746365, -104.987097]
	}
};

var cityCircle;