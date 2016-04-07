// Main variables
var width = window.innerWidth,
    height = window.innerHeight;
var filterWidth = width / 6,
	filterHeight = height;

var radius = 20;

var color = d3.scale.category20();

var force;
var node, link; // nodes and links

var forceDamper = 0.2;

var linksEnabled = true;
var focusPull = false;

var root; // hold svg element

var foci = [];

var filter;

// remove links or low link strength

// Call methods
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
		.attr("height", height);

	// root.append("title")
	// 	.attr("class", "title")
	// 	.attr("x", 0)
	// 	.attr("y", 0)
	// 	.style("stroke", "none")
	// 	.style("fill", "black")
	// 	.text("Understanding the Computer Science Degree");

	// 
	//  ---------------
	// | NETWORK GRAPH |
	//  ---------------
	// 

	// set parameters for graph
	force = d3.layout.force()
		.charge(-200)
		.linkDistance(function (d) {
			return 50;
		}) 
		.gravity(0.1) // larger number, more pull to center
		.friction(0.5) // how mobile does it move - force pulling nodes
		.size([width/2, height]);

	// setup force-directed layout
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
			// recommendations 
			if (d.value == 4 || d.value == 5) {
				return 5;
			} else {
				return 2;
			}
		})
		.style("stroke", function(d) {
			// prereq/rec and
			if (d.value == 0 || d.value == 4) { 
				return "#377EB8";
			} 
			// prereq or 
			else if (d.value == 1 || d.value == 5) { 
				return "#4DAF4A";
			} 
			// antireq and
			else if (d.value == 2) {   
				return "#E41A1C";
			} 
			// antireq or 
			else if (d.value == 3) { 
				return "#FF7F00";
			}  
		});

	// define node group
	var node = root.selectAll(".node")
				.data(cpscgraph.courses)
				.enter().append("g")
				.attr("class", "node")
				.call(force.drag);

	// create circles
	node.append("circle")
		.attr("r", radius)
		.attr("x", 0)
		.attr("y", 0)
		.style("fill", "white")
		.style("stroke", "black");

	// draw node text
	node.append("foreignObject")
		.attr("x", -radius/1.5)
 	 	.attr("y", -radius/2)
 	 	.style("font-family", "Arial")
 	 	.style("font-size", 10)
 	 	.style("stroke", "none")
 	 	.style("fill", "black")
		.html(function(d) { return d.faculty + "<br/>" + d.num ; });

	// Hide the first node in courses since it is a NIL placeholder
	d3.select(".node").style("visibility", "hidden"); 

	// Reposition nodes and attributes based on position
  	force.on("tick", function() {
  		// if we are in hierarchical mode, use fociHierarchy
  		// if we are scatterplot mode, use fociScatter

  		// Combine links to node in correct position
	    link.attr("x1", function(d) { return d.source.x; })
	        .attr("y1", function(d) { return d.source.y; })
	        .attr("x2", function(d) { return d.target.x; })
	        .attr("y2", function(d) { return d.target.y; });

   //      node.attr("cx", function(d) { return d.x; })
			// .attr("cy", function(d) { return d.y; });
       node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
  	});

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

	//  ---------
	// | FILTERS |
	//  ---------
	 root = d3.select("#options")
		.attr("height", height);
}