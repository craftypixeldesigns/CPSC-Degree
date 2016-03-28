// Main variables
var width = window.innerWidth,
    height = window.innerHeight;
var filterWidth = width / 6,
	filterHeight = height;

// Call methods
formatData(courses);	
formatData(degMain);
formatData(degDetails);
formatData(availabilityMain);
formatData(availabilityDetails);
formatData(prereq);
formatData(antireq);
formatData(recommended);
createVis();

// Format data
// coursesHeaders		courses
// degMainHeaders		degMain
// degDetHeaders		degDet
// availMainHeaders		availMain
// availDetHeaders		availDet
// prereqHeaders		prereq
// antireqHeaders		antireq
// recHeaders			rec
function formatData(data) {
	if (data == courses) {
		// extract the row of the data array which has the column names
		coursesHeaders = data.filter(
			function (d) {
				return d.type == "category";
			}
		);
		// the filter() function we called above will give us an array so we should
		// extract the first element of this array, which has the headers
		coursesHeaders = coursesHeaders[0].values;
		
		// do the same thing with the rest of the data with a different filter
		courses = data.filter(
			function (d) {
				return d.type == "course";
			}
		);
	} else if (data == degMain) {
		degMainHeaders = data.filter(
			function (d) {
				return d.type == "category";
			}
		);
		degMainHeaders = degMainHeaders[0].values;
		
		degMain = data.filter(
			function (d) {
				return d.type == "degree";
			}
		);
	} else if (data == degDetails) {
		degDetHeaders = data.filter(
			function (d) {
				return d.type == "category";
			}
		);
		degDetHeaders = degDetHeaders[0].values;
		
		degDet = data.filter(
			function (d) {
				return d.type == "degreeDetail";
			}
		);
	} else if (data == availabilityMain) {
		availMainHeaders = data.filter(
			function (d) {
				return d.type == "category";
			}
		);
		availMainHeaders = availMainHeaders[0].values;
		
		availMain = data.filter(
			function (d) {
				return d.type == "availability";
			}
		);
	} else if (data == availabilityDetails) {
		availDetHeaders = data.filter(
			function (d) {
				return d.type == "category";
			}
		);
		availDetHeaders = availDetHeaders[0].values;
		
		availDet = data.filter(
			function (d) {
				return d.type == "availabilityDetail";
			}
		);
	} else if (data == prereq) {
		prereqHeaders = data.filter(
			function (d) {
				return d.type == "category";
			}
		);
		prereqHeaders = prereqHeaders[0].values;
		
		prereq = data.filter(
			function (d) {
				return d.type == "prereq";
			}
		);
	} else if (data == antireq) {
		antireqHeaders = data.filter(
			function (d) {
				return d.type == "category";
			}
		);
		antireqHeaders = antireqHeaders[0].values;
		
		antireq = data.filter(
			function (d) {
				return d.type == "antireq";
			}
		);
	} else if (data == recommended) {
		recHeaders = data.filter(
			function (d) {
				return d.type == "category";
			}
		);
		recHeaders = recHeaders[0].values;
		
		rec = data.filter(
			function (d) {
				return d.type == "recommended";
			}
		);
	}
}

// Create visualization
function createVis() {
	// select graphics id, set width and height
	root = d3.select("#graphics")
		.attr("width", width)
		.attr("height", height);
}