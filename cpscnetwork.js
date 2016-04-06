// Main variables
var width = window.innerWidth,
    height = 1500;
var filterWidth = width / 6,
	filterHeight = height;

var color = d3.scale.category20();

var force;
var node, link; // nodes and links

var forceDamper = 0.2;

var linksEnabled = true;
var focusPull = false;

var root; // hold svg element

var foci = [];

// Call methods
formatData();


createVis();

// Format data
// courses
// degMain
// degDet
// availMain
// availDet
// prereq
// antireq
// rec
function formatData() {
	// prereq[i].source = courses[i].cid
	// prereq[i].target = courses[i].id

	// antireq

	// recommended
}

// Create visualization
function createVis() {

	// set width and height
	root = d3.select("#graphics")
		.attr("width", width)
		.attr("height", height);

	force = d3.layout.force()
		.charge(-900) // repel
		.linkDistance(function (d) {
			return 100;
		}) 
		.gravity(0.1) // larger number, more pull to center
		.friction(0.5) // how mobile does it move - force pulling nodes
		.size([width, height]);

	//cpscgraph.courses[0].style.display = 'none';

	force
		.nodes(cpscgraph.courses)
		.links(cpscgraph.links)
		.start();

	// define prereq links
  	var link = root.selectAll(".link")
		.data(cpscgraph.links)
		.enter().append("line")
		.attr("class", "link")
		.style("stroke-width", function (d) {
			if (d.value == 4 || d.value == 5) {
				return 5;
			} else {
				return 2;
			}
		})
		.style("stroke", function(d) {
			if (d.value == 0 || d.value == 4) { // prereq/rec and
				return "#377EB8";
			} else if (d.value == 1 || d.value == 5) { // prereq or 
				return "#4DAF4A";
			} else if (d.value == 2) { // antireq and  
				return "#E41A1C";
			} else if (d.value == 3) { // antireq or 
				return "#FF7F00";
			}  
		});

	// define nodes
  	var node = root.selectAll(".node")
		.data(cpscgraph.courses)
		.enter().append("circle")
		.attr("class", "node")
		.attr("r", 10)
		.style("fill", "gray")
		.style("stroke", "transparent")
		.call(force.drag);

	// draw node text
	// node.append("text")
	// 	.attr("x", 50)
 // 	 	.attr("dy", 100)
	// 	.text(function(d) { return d.cname; })
	
	// draw credits
 	for(i=0; i<cpscgraph.courses.length; i++) {
		if (cpscgraph.courses[i].credit == 0.75) {
			// change to #FEE5D9
		} else if (cpscgraph.courses[i].credit == 1.5) {
			// change to #FCAE91
		} else if (cpscgraph.courses[i].credit == 3) {
			// change to #FB6A4A
		} else if (cpscgraph.courses[i].credit == 6) {
			// change to #B85450
		}
	}

	// draw lecture
	 for(i=0; i<cpscgraph.courses.length; i++) {
		if (cpscgraph.courses[i].lecture == 1) {
			// change to #F2F0F7
		} else if (cpscgraph.courses[i].lecture == 2) {
			// change to #CBC9E2
		} else if (cpscgraph.courses[i].lecture == 3) {
			// change to #9E9AC8
		} else if (cpscgraph.courses[i].lecture == 6) {
			// change to #756BB1
		} else if (cpscgraph.courses[i].lecture == 12) {
			// change to #54278F
		}
	}

	// draw lab
	for(i=0; i<cpscgraph.courses.length; i++) {
		if (cpscgraph.courses[i].lab == 0) {
			// change to #FEEBE2
		} else if (cpscgraph.courses[i].lab == 1) {
			// change to #FBB4B9
		} else if (cpscgraph.courses[i].lab == 2) {
			// change to #F768A1
		} else if (cpscgraph.courses[i].lab == 3) {
			// change to #C51B8A
		} else if (cpscgraph.courses[i].lab == 5) {
			// change to #7A0177
		}
	}
	
	// draw consent required
	for(i=0; i<cpscgraph.courses.length; i++) {
		if (cpscgraph.courses[i].consent != "") {
			// apply thicker border class around those courses
			// hide them until later
		}
	}


  	force.on("tick", function() {

    link.attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    node.attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; });
  });
}