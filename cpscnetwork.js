// Main variables
var width = window.innerWidth,
    height = window.outerHeight;
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

// Create filter
function createFilter() {

 	root = d3.select("#filter")
			.attr("height", height);

	filterStream();
	filterNodeLink();
	filterCredits();
	filterLecture();
	filterLab();
	filterAvail();
}

// Availability filter
function filterAvail() {
	d3.select("#scatter").on("click", function(d) {
		if(d3.select(this).style("color") == "rgb(0, 0, 0)") {
			d3.select(this)
							.transition()
							.duration(200)
							.style("background-color","rgb(0, 0, 0)")
		 					.style("color", "rgb(255, 255, 255)")
		 					.style("box-shadow", "0 0 rgb(0, 0, 0)")
		 					.style("top", "5px")
		 					.text("Hierarchy");
			d3.select(".scatter")
							.transition()
							.duration(200)
							.style("opacity", 0);
			d3.select(".hierarchy")
							.transition()
							.duration(200)
							.style("opacity", 1);
		} else {
			d3.select(this)
							.transition()
							.duration(200)
							.style("background-color","rgb(255, 255, 255)")
		 					.style("color", "rgb(0, 0, 0)")
		 					.style("box-shadow", "0 4px rgb(0, 0, 0)")
		 					.style("top", "0")
		 					.text("Scatter");
			d3.select(".scatter")
							.transition()
							.duration(200)
							.style("opacity", 1);
			d3.select(".hierarchy")
							.transition()
							.duration(200)
							.style("opacity", 0);
		}
	});
}

// Course Stream filter
function filterStream() {
	d3.select("#stream1").on("click", function(d) {
		if(d3.select(this).style("color") == "rgb(0, 0, 0)") {
			d3.select(this)
							.transition()
							.duration(200)
							.style("background-color","rgb(0, 0, 0)")
		 					.style("color", "rgb(255, 255, 255)")
		 					.style("box-shadow", "0 0 rgb(0, 0, 0)")
		 					.style("top", "5px");
		} else {
			d3.select(this)
							.transition()
							.duration(200)
							.style("background-color","rgb(255, 255, 255)")
		 					.style("color", "rgb(0, 0, 0)")
		 					.style("box-shadow", "0 4px rgb(0, 0, 0)")
		 					.style("top", "0");
		}

		d3.selectAll(".node").style("fill", function(d) {
			for(i=0; i<degMain.length; i++) {
				if (d.did == degMain[i].did) {
					if(degMain[i].cdid == 1) {
						// TODO change style
					}
				}
			}
		});
	});

	d3.select("#stream2").on("click", function(d) {
		if(d3.select(this).style("color") == "rgb(0, 0, 0)") {
			d3.select(this)
							.transition()
							.duration(200)
							.style("background-color","rgb(0, 0, 0)")
		 					.style("color", "rgb(255, 255, 255)")
		 					.style("box-shadow", "0 0 rgb(0, 0, 0)")
		 					.style("top", "5px");
		} else {
			d3.select(this)
							.transition()
							.duration(200)
							.style("background-color","rgb(255, 255, 255)")
		 					.style("color", "rgb(0, 0, 0)")
		 					.style("box-shadow", "0 4px rgb(0, 0, 0)")
		 					.style("top", "0");
		}

		d3.selectAll(".node").style("fill", function(d) {
			for(i=0; i<degMain.length; i++) {
				if (d.did == degMain[i].did) {
					if(degMain[i].cdid == 2) {
						// TODO change style
					}
				}
			}
		});
	});

	d3.select("#stream3").on("click", function(d) {
		if(d3.select(this).style("color") == "rgb(0, 0, 0)") {
			d3.select(this)
							.transition()
							.duration(200)
							.style("background-color","rgb(0, 0, 0)")
		 					.style("color", "rgb(255, 255, 255)")
		 					.style("box-shadow", "0 0 rgb(0, 0, 0)")
		 					.style("top", "5px");
		} else {
			d3.select(this)
							.transition()
							.duration(200)
							.style("background-color","rgb(255, 255, 255)")
		 					.style("color", "rgb(0, 0, 0)")
		 					.style("box-shadow", "0 4px rgb(0, 0, 0)")
		 					.style("top", "0");
		}

		d3.selectAll(".node").style("fill", function(d) {
			for(i=0; i<degMain.length; i++) {
				if (d.did == degMain[i].did) {
					if(degMain[i].cdid == 3) {
						// TODO change style
					}
				}
			}
		});
	});

	d3.select("#stream4").on("click", function(d) {
		if(d3.select(this).style("color") == "rgb(0, 0, 0)") {
			d3.select(this)
							.transition()
							.duration(200)
							.style("background-color","rgb(0, 0, 0)")
		 					.style("color", "rgb(255, 255, 255)")
		 					.style("box-shadow", "0 0 rgb(0, 0, 0)")
		 					.style("top", "5px");
		} else {
			d3.select(this)
							.transition()
							.duration(200)
							.style("background-color","rgb(255, 255, 255)")
		 					.style("color", "rgb(0, 0, 0)")
		 					.style("box-shadow", "0 4px rgb(0, 0, 0)")
		 					.style("top", "0");
		}

		d3.selectAll(".node").style("fill", function(d) {
			for(i=0; i<degMain.length; i++) {
				if (d.did == degMain[i].did) {
					if(degMain[i].cdid == 4) {
						// TODO change style
					}
				}
			}
		});
	});

	d3.select("#stream5").on("click", function(d) {
		if(d3.select(this).style("color") == "rgb(0, 0, 0)") {
			d3.select(this)
							.transition()
							.duration(200)
							.style("background-color","rgb(0, 0, 0)")
		 					.style("color", "rgb(255, 255, 255)")
		 					.style("box-shadow", "0 0 rgb(0, 0, 0)")
		 					.style("top", "5px");
		} else {
			d3.select(this)
							.transition()
							.duration(200)
							.style("background-color","rgb(255, 255, 255)")
		 					.style("color", "rgb(0, 0, 0)")
		 					.style("box-shadow", "0 4px rgb(0, 0, 0)")
		 					.style("top", "0");
		}

		d3.selectAll(".node").style("fill", function(d) {
			for(i=0; i<degMain.length; i++) {
				if (d.did == degMain[i].did) {
					if(degMain[i].cdid == 5) {
						// TODO change style
					}
				}
			}
		});
	});

	d3.select("#stream6").on("click", function(d) {
		if(d3.select(this).style("color") == "rgb(0, 0, 0)") {
			d3.select(this)
							.transition()
							.duration(200)
							.style("background-color","rgb(0, 0, 0)")
		 					.style("color", "rgb(255, 255, 255)")
		 					.style("box-shadow", "0 0 rgb(0, 0, 0)")
		 					.style("top", "5px");
		} else {
			d3.select(this)
							.transition()
							.duration(200)
							.style("background-color","rgb(255, 255, 255)")
		 					.style("color", "rgb(0, 0, 0)")
		 					.style("box-shadow", "0 4px rgb(0, 0, 0)")
		 					.style("top", "0");
		}

		d3.selectAll(".node").style("fill", function(d) {
			for(i=0; i<degMain.length; i++) {
				if (d.did == degMain[i].did) {
					if(degMain[i].cdid == 6) {
						// TODO change style
					}
				}
			}
		});
	});

	d3.select("#stream7").on("click", function(d) {
		if(d3.select(this).style("color") == "rgb(0, 0, 0)") {
			d3.select(this)
							.transition()
							.duration(200)
							.style("background-color","rgb(0, 0, 0)")
		 					.style("color", "rgb(255, 255, 255)")
		 					.style("box-shadow", "0 0 rgb(0, 0, 0)")
		 					.style("top", "5px");
		} else {
			d3.select(this)
							.transition()
							.duration(200)
							.style("background-color","rgb(255, 255, 255)")
		 					.style("color", "rgb(0, 0, 0)")
		 					.style("box-shadow", "0 4px rgb(0, 0, 0)")
		 					.style("top", "0");
		}

		d3.selectAll(".node").style("fill", function(d) {
			for(i=0; i<degMain.length; i++) {
				if (d.did == degMain[i].did) {
					if(degMain[i].cdid == 7) {
						// TODO change style
					}
				}
			}
		});
	});

	d3.select("#stream8").on("click", function(d) {
		if(d3.select(this).style("color") == "rgb(0, 0, 0)") {
			d3.select(this)
							.transition()
							.duration(200)
							.style("background-color","rgb(0, 0, 0)")
		 					.style("color", "rgb(255, 255, 255)")
		 					.style("box-shadow", "0 0 rgb(0, 0, 0)")
		 					.style("top", "5px");
		} else {
			d3.select(this)
							.transition()
							.duration(200)
							.style("background-color","rgb(255, 255, 255)")
		 					.style("color", "rgb(0, 0, 0)")
		 					.style("box-shadow", "0 4px rgb(0, 0, 0)")
		 					.style("top", "0");
		}

		d3.selectAll(".node").style("fill", function(d) {
			for(i=0; i<degMain.length; i++) {
				if (d.did == degMain[i].did) {
					if(degMain[i].cdid == 8) {
						// TODO change style
					}
				}
			}
		});
	});
}

// Anti-req, recommendations and consent filter
function filterNodeLink() {
	d3.select("#anti").on("click", function(d) {
		if(d3.select(this).style("color") == "rgb(0, 0, 0)") {
			d3.select(this)
							.transition()
							.duration(200)
							.style("background-color","rgb(0, 0, 0)")
		 					.style("color", "rgb(255, 255, 255)")
		 					.style("box-shadow", "0 0 rgb(0, 0, 0)")
		 					.style("top", "5px")
		 					.text("Hide");
		} else {
			d3.select(this)
							.transition()
							.duration(200)
							.style("background-color","rgb(255, 255, 255)")
		 					.style("color", "rgb(0, 0, 0)")
		 					.style("box-shadow", "0 4px rgb(0, 0, 0)")
		 					.style("top", "0")
		 					.text("Display");
		}

		// change visibility of .link-anti
		d3.selectAll(".link-anti")
							.transition()
							.duration(200)
							.style("opacity", function(d) {
								if (d3.select(this).style("opacity") == 1) {
									return 0;
								} else {
									return 1;
								}
							})

	});

	d3.select("#rec").on("click", function(d) {
		if(d3.select(this).style("color") == "rgb(0, 0, 0)") {
			d3.select(this)
							.transition()
							.duration(200)
							.style("background-color","rgb(0, 0, 0)")
		 					.style("color", "rgb(255, 255, 255)")
		 					.style("box-shadow", "0 0 rgb(0, 0, 0)")
		 					.style("top", "5px")
		 					.text("Hide");
		} else {
			d3.select(this)
							.transition()
							.duration(200)
							.style("background-color","rgb(255, 255, 255)")
		 					.style("color", "rgb(0, 0, 0)")
		 					.style("box-shadow", "0 4px rgb(0, 0, 0)")
		 					.style("top", "0")
		 					.text("Display");
		}

		// change visibility of .link-rec
		d3.selectAll(".link-rec")
							.transition()
							.duration(200)
							.style("opacity", function(d) {
								if (d3.select(this).style("opacity") == 1) {
									return 0;
								} else {
									return 1;
								}
							})
	});

	d3.select("#consent").on("click", function(d) {
		if(d3.select(this).style("color") == "rgb(0, 0, 0)") {
			d3.select(this)
							.transition()
							.duration(200)
							.style("background-color","rgb(0, 0, 0)")
		 					.style("color", "rgb(255, 255, 255)")
		 					.style("box-shadow", "0 0 rgb(0, 0, 0)")
		 					.style("top", "5px")
		 					.text("Hide");
		} else {
			d3.select(this)
							.transition()
							.duration(200)
							.style("background-color","rgb(255, 255, 255)")
		 					.style("color", "rgb(0, 0, 0)")
		 					.style("box-shadow", "0 4px rgb(0, 0, 0)")
		 					.style("top", "0")
		 					.text("Display");
		}

		// change border visibility of nodes where d.consent != ""
		// draw consent required
		// 
		d3.select(".node-consent")
								.style("border", "5px");
		for(i=0; i<cpscgraph.courses.length; i++) {
			if (cpscgraph.courses[i].consent != "") {
				// apply thicker border class around those courses
				// hide them until later
			}
		}
	});
}

// Credits filter
function filterCredits() {
	d3.select("#cred1").on("click", function(d) {
		if(d3.select(this).style("color") == "rgb(0, 0, 0)") {
			d3.select(this)
							.transition()
							.duration(200)
							.style("background-color","rgb(254, 229, 217)")
		 					.style("color", "rgb(1, 0, 0)")
		 					.style("box-shadow", "0 0 rgb(254, 229, 217)")
		 					.style("top", "5px");
		} else {
			d3.select(this)
							.transition()
							.duration(200)
							.style("background-color","rgb(255, 255, 255)")
		 					.style("color", "rgb(0, 0, 0)")
		 					.style("box-shadow", "0 4px rgb(254, 229, 217)")
		 					.style("top", "0");
		}

		for(i=0; i<cpscgraph.courses.length; i++) {
			if (cpscgraph.courses[i].credit == 0.75) {
				// change to #FEE5D9
			}
		}
	});

	d3.select("#cred2").on("click", function(d) {
		if(d3.select(this).style("color") == "rgb(0, 0, 0)") {
			d3.select(this)
							.transition()
							.duration(200)
							.style("background-color","rgb(252, 174, 145)")
		 					.style("color", "rgb(1, 0, 0)")
		 					.style("box-shadow", "0 0 rgb(252, 174, 145)")
		 					.style("top", "5px");
		} else {
			d3.select(this)
							.transition()
							.duration(200)
							.style("background-color","rgb(255, 255, 255)")
		 					.style("color", "rgb(0, 0, 0)")
		 					.style("box-shadow", "0 4px rgb(252, 174, 145)")
		 					.style("top", "0");
		}

		for(i=0; i<cpscgraph.courses.length; i++) {
			if (cpscgraph.courses[i].credit == 1.5) {
				// change to #FCAE91
			}
		}
	});

	d3.select("#cred3").on("click", function(d) {
		if(d3.select(this).style("color") == "rgb(0, 0, 0)") {
			d3.select(this)
							.transition()
							.duration(200)
							.style("background-color","rgb(251, 106, 74)")
		 					.style("color", "rgb(255, 255, 255)")
		 					.style("box-shadow", "0 0 rgb(251, 106, 74)")
		 					.style("top", "5px");
		} else {
			d3.select(this)
							.transition()
							.duration(200)
							.style("background-color","rgb(255, 255, 255)")
		 					.style("color", "rgb(0, 0, 0)")
		 					.style("box-shadow", "0 4px rgb(251, 106, 74)")
		 					.style("top", "0");
		}
		
		for(i=0; i<cpscgraph.courses.length; i++) {
			if (cpscgraph.courses[i].credit == 3) {
				// change to #FB6A4A
			}
		}
	});

	d3.select("#cred4").on("click", function(d) {
		if(d3.select(this).style("color") == "rgb(0, 0, 0)") {
			d3.select(this)
							.transition()
							.duration(200)
							.style("background-color","rgb(184, 84, 80)")
		 					.style("color", "rgb(255, 255, 255)")
		 					.style("box-shadow", "0 0 rgb(184, 84, 80)")
		 					.style("top", "5px");
		} else {
			d3.select(this)
							.transition()
							.duration(200)
							.style("background-color","rgb(255, 255, 255)")
		 					.style("color", "rgb(0, 0, 0)")
		 					.style("box-shadow", "0 4px rgb(184, 84, 80)")
		 					.style("top", "0");
		}
		
		for(i=0; i<cpscgraph.courses.length; i++) {
			if (cpscgraph.courses[i].credit == 6) {
				// change to #B85450
			}
		}
	});
}

// Lecture filter
function filterLecture() {
	d3.select("#lec1").on("click", function(d) {
		if(d3.select(this).style("color") == "rgb(0, 0, 0)") {
			d3.select(this)
							.transition()
							.duration(200)
							.style("background-color","rgb(242, 240, 247)")
		 					.style("color", "rgb(1, 0, 0)")
		 					.style("box-shadow", "0 0 rgb(242, 240, 247)")
		 					.style("top", "5px");
		} else {
			d3.select(this)
							.transition()
							.duration(200)
							.style("background-color","rgb(255, 255, 255)")
		 					.style("color", "rgb(0, 0, 0)")
		 					.style("box-shadow", "0 4px rgb(242, 240, 247)")
		 					.style("top", "0");
		}
		
		for(i=0; i<cpscgraph.courses.length; i++) {
			if (cpscgraph.courses[i].lecture == 1) {
				// change to #F2F0F7
			}
		}
	});

	d3.select("#lec2").on("click", function(d) {
		if(d3.select(this).style("color") == "rgb(0, 0, 0)") {
			d3.select(this)
							.transition()
							.duration(200)
							.style("background-color","rgb(203, 201, 226)")
		 					.style("color", "rgb(1, 0, 0)")
		 					.style("box-shadow", "0 0 rgb(203, 201, 226)")
		 					.style("top", "5px");
		} else {
			d3.select(this)
							.transition()
							.duration(200)
							.style("background-color","rgb(255, 255, 255)")
		 					.style("color", "rgb(0, 0, 0)")
		 					.style("box-shadow", "0 4px rgb(203, 201, 226)")
		 					.style("top", "0");
		}
		
		for(i=0; i<cpscgraph.courses.length; i++) {
			if (cpscgraph.courses[i].lecture == 2) {
				// change to #CBC9E2
			}
		}
	});

	d3.select("#lec3").on("click", function(d) {
		if(d3.select(this).style("color") == "rgb(0, 0, 0)") {
			d3.select(this)
							.transition()
							.duration(200)
							.style("background-color","rgb(158, 154, 200)")
		 					.style("color", "rgb(1, 0, 0)")
		 					.style("box-shadow", "0 0 rgb(158, 154, 200)")
		 					.style("top", "5px");
		} else {
			d3.select(this)
							.transition()
							.duration(200)
							.style("background-color","rgb(255, 255, 255)")
		 					.style("color", "rgb(0, 0, 0)")
		 					.style("box-shadow", "0 4px rgb(158, 154, 200)")
		 					.style("top", "0");
		}
		
		for(i=0; i<cpscgraph.courses.length; i++) {
			if (cpscgraph.courses[i].lecture == 3) {
				// change to #9E9AC8
			}
		}
	});

	d3.select("#lec4").on("click", function(d) {
		if(d3.select(this).style("color") == "rgb(0, 0, 0)") {
			d3.select(this)
							.transition()
							.duration(200)
							.style("background-color","rgb(117, 107, 177)")
		 					.style("color", "rgb(255, 255, 255)")
		 					.style("box-shadow", "0 0 rgb(117, 107, 177)")
		 					.style("top", "5px");
		} else {
			d3.select(this)
							.transition()
							.duration(200)
							.style("background-color","rgb(255, 255, 255)")
		 					.style("color", "rgb(0, 0, 0)")
		 					.style("box-shadow", "0 4px rgb(117, 107, 177)")
		 					.style("top", "0");
		}
		
		for(i=0; i<cpscgraph.courses.length; i++) {
			if (cpscgraph.courses[i].credit .lecture == 6) {
				// change to #756BB1
			}
		}
	});

	d3.select("#lec5").on("click", function(d) {
		if(d3.select(this).style("color") == "rgb(0, 0, 0)") {
			d3.select(this)
							.transition()
							.duration(200)
							.style("background-color","rgb(84, 39, 143)")
		 					.style("color", "rgb(255, 255, 255)")
		 					.style("box-shadow", "0 0 rgb(84, 39, 143)")
		 					.style("top", "5px");
		} else {
			d3.select(this)
							.transition()
							.duration(200)
							.style("background-color","rgb(255, 255, 255)")
		 					.style("color", "rgb(0, 0, 0)")
		 					.style("box-shadow", "0 4px rgb(84, 39, 143)")
		 					.style("top", "0");
		}
		
		for(i=0; i<cpscgraph.courses.length; i++) {
			if (cpscgraph.courses[i].lecture == 12) {
				// change to #54278F
			}
		}
	});
}

// Lab filter
function filterLab() {
	d3.select("#lab1").on("click", function(d) {
		if(d3.select(this).style("color") == "rgb(0, 0, 0)") {
			d3.select(this)
							.transition()
							.duration(200)
							.style("background-color","rgb(254, 235, 226)")
		 					.style("color", "rgb(1, 0, 0)")
		 					.style("box-shadow", "0 0 rgb(254, 235, 226)")
		 					.style("top", "5px");
		} else {
			d3.select(this)
							.transition()
							.duration(200)
							.style("background-color","rgb(255, 255, 255)")
		 					.style("color", "rgb(0, 0, 0)")
		 					.style("box-shadow", "0 4px rgb(254, 235, 226)")
		 					.style("top", "0");
		}
		
		for(i=0; i<cpscgraph.courses.length; i++) {
			if (cpscgraph.courses[i].lab == 0) {
				// change to #FEEBE2
			}
		}
	});

	d3.select("#lab2").on("click", function(d) {
		if(d3.select(this).style("color") == "rgb(0, 0, 0)") {
			d3.select(this)
							.transition()
							.duration(200)
							.style("background-color","rgb(251, 180, 185)")
		 					.style("color", "rgb(1, 0, 0)")
		 					.style("box-shadow", "0 0 rgb(251, 180, 185)")
		 					.style("top", "5px");
		} else {
			d3.select(this)
							.transition()
							.duration(200)
							.style("background-color","rgb(255, 255, 255)")
		 					.style("color", "rgb(0, 0, 0)")
		 					.style("box-shadow", "0 4px rgb(251, 180, 185)")
		 					.style("top", "0");
		}
		
		for(i=0; i<cpscgraph.courses.length; i++) {
			if (cpscgraph.courses[i].lab == 1) {
				// change to #FBB4B9
			}
		}
	});

	d3.select("#lab3").on("click", function(d) {
		if(d3.select(this).style("color") == "rgb(0, 0, 0)") {
			d3.select(this)
							.transition()
							.duration(200)
							.style("background-color","rgb(247, 101, 161)")
		 					.style("color", "rgb(1, 0, 0)")
		 					.style("box-shadow", "0 0 rgb(247, 101, 161)")
		 					.style("top", "5px");
		} else {
			d3.select(this)
							.transition()
							.duration(200)
							.style("background-color","rgb(255, 255, 255)")
		 					.style("color", "rgb(0, 0, 0)")
		 					.style("box-shadow", "0 4px rgb(247, 101, 161)")
		 					.style("top", "0");
		}
		
		for(i=0; i<cpscgraph.courses.length; i++) {
			if (cpscgraph.courses[i].lecture .lab == 2) {
				// change to #F768A1
			}
		}
	});


	d3.select("#lab4").on("click", function(d) {
		if(d3.select(this).style("color") == "rgb(0, 0, 0)") {
			d3.select(this)
							.transition()
							.duration(200)
							.style("background-color","rgb(197, 27, 138)")
		 					.style("color", "rgb(255, 255, 255)")
		 					.style("box-shadow", "0 0 rgb(197, 27, 138)")
		 					.style("top", "5px");
		} else {
			d3.select(this)
							.transition()
							.duration(200)
							.style("background-color","rgb(255, 255, 255)")
		 					.style("color", "rgb(0, 0, 0)")
		 					.style("box-shadow", "0 4px rgb(197, 27, 138)")
		 					.style("top", "0");
		}
		
		for(i=0; i<cpscgraph.courses.length; i++) {
			if (cpscgraph.courses[i].credit .lecture .lab == 3) {
				// change to #C51B8A
			}
		}
	});

	d3.select("#lab5").on("click", function(d) {
		if(d3.select(this).style("color") == "rgb(0, 0, 0)") {
			d3.select(this)
							.transition()
							.duration(200)
							.style("background-color","rgb(122, 1, 119)")
		 					.style("color", "rgb(255, 255, 255)")
		 					.style("box-shadow", "0 0 rgb(122, 1, 119)")
		 					.style("top", "5px");
		} else {
			d3.select(this)
							.transition()
							.duration(200)
							.style("background-color","rgb(255, 255, 255)")
		 					.style("color", "rgb(0, 0, 0)")
		 					.style("box-shadow", "0 4px rgb(122, 1, 119)")
		 					.style("top", "0");
		}
		
		for(i=0; i<cpscgraph.courses.length; i++) {
			if (cpscgraph.courses[i].lab == 5) {
				// change to #7A0177
			}
		}
	});
}

// Select interaction makes different info appear
function appearInfo(type) {
	var div = d3.select("div.infoBox");
	var html;

	var courseIndex, degIndex;

	// Inspired from http://codepen.io/smlo/pen/JdMOej
	d3.selectAll(".node").on("click", function(d) {
		// TODO not working
		// d3.select(".circle").style("fill","green"); 
		if (div.style("visibility") == "hidden") {
			div.style("visibility", "visible")
				.transition()
				.duration(200)
				.style("opacity", 1);
		} else {
			div.style("visibility", "hidden")
				.transition()
				.duration(200)
				.style("opacity", 0);
		}

		html = "<h3>" + d.cnum + ":</h3>" + "<h4>" + d.cname + "</h4>";

		if(type == "stream") {
			if (d.did != 0) {
				html += "Course Streams:<ul>";

				for(i=0; i<degMain.length; i++) {
					if (d.did == degMain[i].did) {
						html += "<li>" + degDetails[degMain[i].cdid].type + "</li>";
					}
				}

				html += "</ul>"
			}
		} else if (type == "consent") {
			if (d.consent != "") {
				html += "Consent required by " + d.consent;
			}
		} else if (type == "type") {
			if (d.ctype == "senior" || d.ctype == "junior") {
				html += d.ctype.toUpperCase() + " level course";
			} else {
				html += d.ctype.toUpperCase();
			}
		}
		
		div.html(html)
			.attr("height", "auto")
			.style("left", (d.x + 15) + "px")
			.style("top", (d.y - 30) + "px");
	});
}

// Hover/select interaction makes nodes highlighted
// TODO: make associated links highlighted
function highlightNodes() {
	d3.selectAll(".node").on("mouseover", function(d) {
		d3.select(this)
						.transition()
						.duration(200)
						.style("fill","green");
	});

}