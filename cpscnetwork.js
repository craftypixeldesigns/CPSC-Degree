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
createFilter();
appearInfo("type");

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
		.charge(-400)
		.linkDistance(function (d) {
			return 400;
		}) 
		.gravity(0.2) // larger number, more pull to center
		.friction(0) // how mobile does it move - force pulling nodes
		.size([width/2, height]);

	// setup force-directed layout
	force
		.nodes(cpscgraph.courses)
		.links(cpscgraph.links)
		.start();

	// draw link arrows
	root.append("svg:defs").selectAll("marker")
	    .data(cpscgraph.links)      // Different link/path types can be defined here
	  	.enter().append("svg:marker")    // This section adds in the arrows
	    .attr("id", "end")
	    .attr("viewBox", "-5 -5 10 10")
	    .attr("refX", 15)
	    .attr("refY", -1.5)
	    .attr("markerWidth", 6)
	    .attr("markerHeight", 6)
	    .attr("orient", "auto")
	  	.append("svg:path")
	  	.attr("d", "M 0,0 m -5,-5 L 5,0 L -5,5 Z")
	  	.style("fill", function(d) { //TODO not working
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
	    // .attr("d", "M0,-5L10,0L0,5");

	// define prereq links
  	var link = root.selectAll(".link")
		.data(cpscgraph.links)
		.enter().append("line")
		.attr("marker-end", "url(#end)")
		.attr("class", function (d) {
			if (d.value == 0 || d.value == 1) { 
				return "link link-prereq";
			} 
			else if (d.value == 2 || d.value == 3) {   
				return "link link-anti";
			} 
			else if (d.value == 4 || d.value == 5) { 
				return "link link-rec";
			} 
		})
		.style("stroke-width", function (d) {
			// recommendations 
			if (d.value == 4 || d.value == 5) {
				return 3;
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
				.attr("class", function(d) {
					if (d.consent != "") {
						return "node node-consent"
					} else {
						return "node";
					}
				})
				.call(force.drag);

	// create circles
	node.append("circle")
		.attr("class", "circle")
		.attr("r", radius)
		.attr("x", 0)
		.attr("y", 0)
		.style("fill", "white")
		.style("stroke", "black");

	// draw node text
	node.append("foreignObject")
		.attr("class", "text")
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
	    link
	    	.attr("x1", function(d) { return d.source.x; })
	        .attr("y1", function(d) { return d.source.y; })
	        .attr("x2", function(d) { return d.target.x; })
	        .attr("y2", function(d) { return d.target.y; });

       node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

  	});


}

