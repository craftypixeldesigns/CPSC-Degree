// Main variables
var width = window.innerWidth,
    height = 1800;
var filterWidth = width / 6,
	filterHeight = height;

var force;
var node, link; // nodes and links
var radius = 21.5;
var root; // hold svg element

var filter;

// remove links or low link strength

// Call methods
createVis();
createFilter();
appearInfo("");
highlightNodes();
// var numOfPrereqs = countPrereqs();
// console.log(numOfPrereqs.length);

// Create visualization
function createVis() {

	// set width and height
	root = d3.select("#graphics")
		.attr("height", height);

	// title
	root.append("text")
		.attr("class", "title")
		.attr("x", "20px")
		.attr("y", "50px")
		.style("stroke", "none")
		.style("fill", "black")
		.text("Understanding the Computer Science Degree");

	// 
	//  ---------------
	// | NETWORK GRAPH |
	//  ---------------
	// 

	// set parameters for graph
	force = d3.layout.force()
		.linkStrength(.001)
		.charge(-radius * (radius))
		.gravity(0.1)
		.friction(0.7)
		.size([width/2, height]);

	// setup force-directed layout
	force
		.nodes(cpscgraph.courses)
		.links(cpscgraph.links)
		.start();

	// draw link arrows
	root.append("svg:defs").selectAll("marker")
	    .data(cpscgraph.links)      // Different link/path types can be defined here
	  	.enter()
	  	.append("svg:marker")    // This section adds in the arrows
	    .attr("id", function(d) {
	    	if (d.value == 0 || d.value == 4) { 
				return "link-and";
			} 
			// prereq or 
			else if (d.value == 1 || d.value == 5) { 
				return "link-or";
			} 
			// antireq and
			else if (d.value == 2) {   
				return "antireq-and";
			} 
			// antireq or 
			else if (d.value == 3) { 
				return "antireq-or";
			} 
	    })
	    .attr("viewBox", "-5 -5 10 10")
	    .attr("refX", 15)
	    .attr("refY", -1.5)
	    .attr("markerWidth", 6)
	    .attr("markerHeight", 6)
	    .attr("orient", "auto")
	  	.append("svg:path")
	  	.attr("d", "M 0,0 m -5,-5 L 5,0 L -5,5 Z")
	  	.style("fill", function(d) { 
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

	// define prereq links
  	var link = root.selectAll(".link")
		.data(cpscgraph.links)
		.enter().append("line")
		.attr("marker-end", function (d) {
			if (d.value == 0 || d.value == 4) { 
				return "url(#link-and)";
			} 
			// prereq or 
			else if (d.value == 1 || d.value == 5) { 
				return "url(#link-or)";
			} 
			// antireq and
			else if (d.value == 2) {   
				return "url(#antireq-and)";
			} 
			// antireq or 
			else if (d.value == 3) { 
				return "url(#antireq-or)";
			} 
		})
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

	// hide anti-req and recommendations links
	d3.select("#anti")
				.style("background-color","rgb(0, 0, 0)")
				.style("color", "rgb(255, 255, 255)")
				.style("box-shadow", "0 0 rgb(0, 0, 0)")
				.style("top", "5px")
				.text("Hidden");
	d3.selectAll(".link-anti")
				.style("opacity", 0);

	d3.select("#rec")
				.style("background-color","rgb(0, 0, 0)")
				.style("color", "rgb(255, 255, 255)")
				.style("box-shadow", "0 0 rgb(0, 0, 0)")
				.style("top", "5px")
				.text("Hidden");
	d3.selectAll(".link-rec")
				.style("opacity", 0);

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
		.style("stroke", "black")
		.attr("data-streamState", 0)
		.attr("data-toggle", 0);
		// add circles based off credits

	// draw node text
	node.append("foreignObject")
		.attr("class", "text")
		.attr("x", -radius/1.4)
 	 	.attr("y", -radius/1.5)
		.html(function(d) { return "<p class=\"name\">" + d.faculty + "<br/>" + d.num + "</p>"; });

	// Hide the first node in courses since it is a NIL placeholder
	d3.select(".node").style("visibility", "hidden"); 

	var focusHierarchyY = 
		[
			(height/5)*0.25,
			(height/5)*1,
			(height/5)*1.75,
			(height/5)*2.5,
			(height/5)*3.25,
			height
		]; 
	var focusHierarchyX = 
		[
			(width/5),
			(width/5)*1.5,
			(width/5)*2,
			(width/5)*2.5,
			(width/5)*3,
			width
		]; 
	var focusScatter = [];

	var forceDamper = 0.5;
	var linksEnabled = true;
	var focusPull = false;

	var maxGroups = 5;

	// Reposition nodes and attributes based on position
  	force.on("tick", function(e) {

  		if (true) {
  			console.log(height);
  			_.each(cpscgraph.courses, function(d, i) {
				if (d.num > 0 && d.num < 200) {
					d.y = d.y + (focusHierarchyY[0] - d.y) * forceDamper * e.alpha;
				} else if (d.num >= 200 && d.num < 300) {
					d.y = d.y + (focusHierarchyY[1] - d.y) * forceDamper * e.alpha;
				} else if (d.num >= 300 && d.num < 400) {
					d.y = d.y + (focusHierarchyY[2] - d.y) * forceDamper * e.alpha;
				} else if (d.num >= 400 && d.num < 500) {
					d.y = d.y + (focusHierarchyY[3] - d.y) * forceDamper * e.alpha;
				} else if (d.num >= 500 && d.num < 600) {
					d.y = d.y + (focusHierarchyY[4] - d.y) * forceDamper * e.alpha;
				}

				// position d.cid based off countprereq
				// 

				/*
				Method: group by last two digits*/

				var lastNums = d.num % 100;

				if (lastNums >= 0 && lastNums < 20) {
					d.x = d.x + (focusHierarchyX[0] - d.x) * forceDamper * e.alpha;
				} else if (lastNums >= 20 && lastNums < 40) {
					d.x = d.x + (focusHierarchyX[1] - d.x) * forceDamper * e.alpha;
				} else if (lastNums >= 40 && lastNums < 60) {
					d.x = d.x + (focusHierarchyX[2] - d.x) * forceDamper * e.alpha;
				} else if (lastNums >= 60 && lastNums < 80) {
					d.x = d.x + (focusHierarchyX[3] - d.x) * forceDamper * e.alpha;
				} else if (lastNums >= 80 && lastNums < 100) {
					d.x = d.x + (focusHierarchyX[4] - d.x) * forceDamper * e.alpha;
				}
				//*/
			});
  		}


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

// Count number of times a course is used as a prereq
function countPrereqs() {
	var prereqCourses = [];
	var current = null;
	var count = 0;

	var countPrereq = new Object();

	_.each(cpscgraph.courses, function(d, i) {
		for (i=0; i < cpscgraph.links.length; i++) {
			if (cpscgraph.links[i].source.cid == d.cid) {
				prereqCourses.push(d.cid);
			} 
		}

		for (i=0; i< prereqCourses.length; i++) {
			if(prereqCourses[i] != current) {
				if (count > 0) {
					countPrereq[current] = current;
					countPrereq[count] = count;
				}

				current = prereqCourses[i];
				count = 1;
			} else {
				count++;
			}
		}

		if (count > 0) {
			countPrereq[current] = current;
			countPrereq[count] = count;
			console.log(countPrereq[current] + ", " + countPrereq[count]);
		}
	});

	var sorted = countPrereq.slice(0).sort(function(a,b) {
		return a.count - b.count;
	});

	var keys = [];
	for (i=0; i < sorted.length; ++i) {
		keys[i] = sorted[i].current;
	}
	console.log("keys " + keys);

	return keys;
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
			appearInfo("avail");
			d3.select(this)
							.transition()
							.duration(200)
							.style("background-color","rgb(0, 0, 0)")
		 					.style("color", "rgb(255, 255, 255)")
		 					.style("box-shadow", "0 0 rgb(0, 0, 0)")
		 					.style("top", "5px")
		 					.text("Hierarchy");
		} else {
			appearInfo("");
			d3.select(this)
							.transition()
							.duration(200)
							.style("background-color","rgb(255, 255, 255)")
		 					.style("color", "rgb(0, 0, 0)")
		 					.style("box-shadow", "0 4px rgb(0, 0, 0)")
		 					.style("top", "0")
		 					.text("Scatter");
		}
	});
}

//
// Retrieves node style and returns an rgb color based off
// course stream and toggle state
function getNodeStyle(obj) {
	var streamState = parseInt(obj.getAttribute("data-streamState"));
	var isHighlighted = parseInt(obj.getAttribute("data-toggleState"));
	switch (streamState) {
		case 0:
			return "rgb(255, 255, 255)";
			break;
		case 1:
			return "rgb(240, 240, 240)";
			break;
		case 2:
			return "rgb(217, 217, 217)";
			break;
		case 3: 
			return "rgb(189, 189, 189)";
			break;
		case 4:
			return "rgb(150, 150, 150)";
			break;
		default:
			return "rgb(115, 115, 115)";
	}
}

function changeCourseFilters() {
	// extract streamID
	if (this.id == "stream1") 
		streamID = 1;
	else if (this.id == "stream2") 
		streamID = 2;
	else if (this.id == "stream3") 
		streamID = 3;
	else if (this.id == "stream4") 
		streamID = 4;
	else if (this.id == "stream5") 
		streamID = 5;
	else if (this.id == "stream6") 
		streamID = 6;
	else if (this.id == "stream7") 
		streamID = 7;
	else if (this.id == "stream8") 
		streamID = 8;
	else {
		console.log("ASSERT: Illegal stream id (" + this.id + ")");
		return;
	}
	//streamID = this.id == "stream1" ? 1 : (this.id == "stream2" ? 2 : (this.id == "stream3" ? 3 : (this.id == "stream4" ? 4 : (this.id == "stream5" ? 5 : (this.id == "stream6" ? 6 : 7)))));

	var buttonState = 0;

	// determine button state
	if(d3.select(this).style("color") == "rgb(0, 0, 0)") {
		buttonState = 1;
		appearInfo("stream");

		d3.select(this)
						.transition()
						.duration(200)
						.style("background-color","rgb(0, 0, 0)")
	 					.style("color", "rgb(255, 255, 255)")
	 					.style("box-shadow", "0 0 rgb(0, 0, 0)")
	 					.style("top", "5px");

	 } else {
	 	buttonState = -1;
		appearInfo("");

		d3.select(this)
						.transition()
						.duration(200)
						.style("background-color","rgb(255, 255, 255)")
	 					.style("color", "rgb(0, 0, 0)")
	 					.style("box-shadow", "0 4px rgb(0, 0, 0)")
	 					.style("top", "0");

	}
	console.log("\n===============\n");
 	d3.selectAll("circle").style("fill", function(d) {

		for(i=0; i < course2stream.length; i++) {
			if (d.cid == course2stream[i].cid && course2stream[i].cdid == streamID) {
					this.setAttribute("data-streamState", parseInt(this.getAttribute("data-streamState")) + parseInt(buttonState));
					console.log("TESt: " + d.cid + " " + this.getAttribute("data-streamState"));
					return getNodeStyle(this);
			}	
		}
		return "rgb(255, 255, 255)";
	});

}

// Course Stream filter
function filterStream() {
	d3.select("#stream1").on("click", changeCourseFilters);
	d3.select("#stream2").on("click", changeCourseFilters);
	d3.select("#stream3").on("click", changeCourseFilters);
	d3.select("#stream4").on("click", changeCourseFilters);
	d3.select("#stream5").on("click", changeCourseFilters);
	d3.select("#stream6").on("click", changeCourseFilters);
	d3.select("#stream7").on("click", changeCourseFilters);
	d3.select("#stream8").on("click", changeCourseFilters);
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
		 					.text("Hidden");
		} else {
			d3.select(this)
							.transition()
							.duration(200)
							.style("background-color","rgb(255, 255, 255)")
		 					.style("color", "rgb(0, 0, 0)")
		 					.style("box-shadow", "0 4px rgb(0, 0, 0)")
		 					.style("top", "0")
		 					.text("Visible");
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
		 					.text("Hidden");
		} else {
			d3.select(this)
							.transition()
							.duration(200)
							.style("background-color","rgb(255, 255, 255)")
		 					.style("color", "rgb(0, 0, 0)")
		 					.style("box-shadow", "0 4px rgb(0, 0, 0)")
		 					.style("top", "0")
		 					.text("Visible");
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
			appearInfo("consent");
			d3.select(this)
							.transition()
							.duration(200)
							.style("background-color","rgb(0, 0, 0)")
		 					.style("color", "rgb(255, 255, 255)")
		 					.style("box-shadow", "0 0 rgb(0, 0, 0)")
		 					.style("top", "5px")
		 					.text("Hidden");
		} else {
			appearInfo("");

			d3.select(this)
							.transition()
							.duration(200)
							.style("background-color","rgb(255, 255, 255)")
		 					.style("color", "rgb(0, 0, 0)")
		 					.style("box-shadow", "0 4px rgb(0, 0, 0)")
		 					.style("top", "0")
		 					.text("Visible");
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

// svg has no z-index
// what's drawn first is on top
// just have lots of circles
// node, draw circles within it 
// 	auto hide, then make it appear
// 	outmost black, outside all of them

// Credits filter
function filterCredits() {
	d3.select("#cred1").on("click", function(d) {
		if(d3.select(this).style("color") == "rgb(0, 0, 0)") {
			appearInfo("type");

			d3.select(this)
							.transition()
							.duration(200)
							.style("background-color","rgb(254, 229, 217)")
		 					.style("color", "rgb(1, 0, 0)")
		 					.style("box-shadow", "0 0 rgb(254, 229, 217)")
		 					.style("top", "5px");
		} else {
			appearInfo("");

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
			appearInfo("type");

			d3.select(this)
							.transition()
							.duration(200)
							.style("background-color","rgb(252, 174, 145)")
		 					.style("color", "rgb(1, 0, 0)")
		 					.style("box-shadow", "0 0 rgb(252, 174, 145)")
		 					.style("top", "5px");
		} else {
			appearInfo("");

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
			appearInfo("type");

			d3.select(this)
							.transition()
							.duration(200)
							.style("background-color","rgb(251, 106, 74)")
		 					.style("color", "rgb(255, 255, 255)")
		 					.style("box-shadow", "0 0 rgb(251, 106, 74)")
		 					.style("top", "5px");
		} else {
			appearInfo("");

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
			appearInfo("type");

			d3.select(this)
							.transition()
							.duration(200)
							.style("background-color","rgb(184, 84, 80)")
		 					.style("color", "rgb(255, 255, 255)")
		 					.style("box-shadow", "0 0 rgb(184, 84, 80)")
		 					.style("top", "5px");
		} else {
			appearInfo("");

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
		appearInfo("type");

		if(d3.select(this).style("color") == "rgb(0, 0, 0)") {
			d3.select(this)
							.transition()
							.duration(200)
							.style("background-color","rgb(242, 240, 247)")
		 					.style("color", "rgb(1, 0, 0)")
		 					.style("box-shadow", "0 0 rgb(242, 240, 247)")
		 					.style("top", "5px");
		} else {
			appearInfo("");

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
			appearInfo("type");

			d3.select(this)
							.transition()
							.duration(200)
							.style("background-color","rgb(203, 201, 226)")
		 					.style("color", "rgb(1, 0, 0)")
		 					.style("box-shadow", "0 0 rgb(203, 201, 226)")
		 					.style("top", "5px");
		} else {
			appearInfo("");

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
			appearInfo("type");

			d3.select(this)
							.transition()
							.duration(200)
							.style("background-color","rgb(158, 154, 200)")
		 					.style("color", "rgb(1, 0, 0)")
		 					.style("box-shadow", "0 0 rgb(158, 154, 200)")
		 					.style("top", "5px");
		} else {
			appearInfo("");

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
			appearInfo("type");

			d3.select(this)
							.transition()
							.duration(200)
							.style("background-color","rgb(117, 107, 177)")
		 					.style("color", "rgb(255, 255, 255)")
		 					.style("box-shadow", "0 0 rgb(117, 107, 177)")
		 					.style("top", "5px");
		} else {
			appearInfo("");

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
			appearInfo("type");

			d3.select(this)
							.transition()
							.duration(200)
							.style("background-color","rgb(84, 39, 143)")
		 					.style("color", "rgb(255, 255, 255)")
		 					.style("box-shadow", "0 0 rgb(84, 39, 143)")
		 					.style("top", "5px");
		} else {
			appearInfo("");

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
			appearInfo("type");

			d3.select(this)
							.transition()
							.duration(200)
							.style("background-color","rgb(254, 235, 226)")
		 					.style("color", "rgb(1, 0, 0)")
		 					.style("box-shadow", "0 0 rgb(254, 235, 226)")
		 					.style("top", "5px");
		} else {
			appearInfo("");

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
			appearInfo("type");

			d3.select(this)
							.transition()
							.duration(200)
							.style("background-color","rgb(251, 180, 185)")
		 					.style("color", "rgb(1, 0, 0)")
		 					.style("box-shadow", "0 0 rgb(251, 180, 185)")
		 					.style("top", "5px");
		} else {
			appearInfo("");

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
			appearInfo("type");

			d3.select(this)
							.transition()
							.duration(200)
							.style("background-color","rgb(247, 101, 161)")
		 					.style("color", "rgb(1, 0, 0)")
		 					.style("box-shadow", "0 0 rgb(247, 101, 161)")
		 					.style("top", "5px");
		} else {
			appearInfo("");

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
			appearInfo("type");

			d3.select(this)
							.transition()
							.duration(200)
							.style("background-color","rgb(197, 27, 138)")
		 					.style("color", "rgb(255, 255, 255)")
		 					.style("box-shadow", "0 0 rgb(197, 27, 138)")
		 					.style("top", "5px");
		} else {
			appearInfo("");

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
			appearInfo("type");

			d3.select(this)
							.transition()
							.duration(200)
							.style("background-color","rgb(122, 1, 119)")
		 					.style("color", "rgb(255, 255, 255)")
		 					.style("box-shadow", "0 0 rgb(122, 1, 119)")
		 					.style("top", "5px");
		} else {
			appearInfo("");

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
		console.log("nodeclicked ", d );
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

				for(i=0; i<course2stream.length; i++) {
					if (d.cid == course2stream[i].cid) {
						html += "<li>" + degDetails[course2stream[i].cdid].type + "</li>";
					}
				}

				html += "</ul>"
			}
		} else if (type == "avail") {
			html += "Availability:<ul>";
			
			 for (var j=0; j<availabilityMain.length; j++) {
				if (d.cid == availabilityMain[j].cid) {
					html += "<li>" + availabilityDetails[availabilityMain[j].aid].semester + "</li>";
				}
 		 	}

 			html += "</ul>"
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

function toggleNode(obj) {
	if(obj.getAttribute("data-toggle") == 0) {
		obj.setAttribute("data-toggle", 1);
	} else {
		obj.setAttribute("data-toggle", 0);
	}
}
	
// DEPRECATED
function setSat(obj, value) {
	// get existing HSLA
	var str = obj.style("fill");

	// extract values
	str = str.split(",");
	var h = str[0].split("(")[1];
	var s = str[1];
	var l = str[2];
	var a = str[3].split(")")[0];
	console.log("H:"+ h + "\n" + "L:"+ l + "\n" + "S:"+ s + "\n" + "A:"+ a + "\n");
	//obj.style("fill", str);
}

// Hover/select interaction makes nodes highlighted
// TODO: make associated links highlighted
function highlightNodes() {
	// highlight circles
	d3.selectAll("circle").on("mouseover", function(d) {
		// d3.select(this).style("fill", "hsla(120, 100%, 50%, 1.0)");
		// str = d3.select(this).style("fill").split(",");
		// console.log(str);
		// var h = str[0].split("(")[1];
		// var s = str[1];
		// var l = str[2];
		// var a = str[3].split(")")[0];
		// console.log("H:"+ h + "\n" + "L:"+ l + "\n" + "S:"+ s + "\n" + "A:"+ a + "\n");

		if (this.getAttribute("data-toggle") == 0) {

			d3.select(this).style("stroke", "rgb(249, 222, 99)")
							.style("fill","rgb(249, 222, 99)");
		}

	});

	// unhighlight circles
	d3.selectAll("circle").on("mouseleave", function(d) {
		var fillStr = getNodeStyle(this);


		if (this.getAttribute("data-toggle") == 0) {
			d3.select(this).style("stroke", "rgb(0, 0, 0)")
							.style("fill",fillStr);
							
		}
	}); 

	
	// toggle circle highlighting
	d3.selectAll("circle").on("click", function(d) {
		toggleNode(this);	
	});

	d3.selectAll("foreignObject").on("click", function(d) {
		toggleNode(this.previousSibling);
		
	});

	d3.selectAll("foreignObject").on("mouseover", function(d) {
		d3.select(this.previousSibling).style("stroke", "rgb(249, 222, 99)")
										.style("fill","rgb(249, 222, 99)");
	});

	d3.selectAll("foreignObject").on("mouseleave", function(d) {
		var fillStr = getNodeStyle(this);

		if (this.previousSibling.getAttribute("data-toggle") == 0) {
			d3.select(this.previousSibling).style("stroke", "rgb(0, 0, 0)")
											.style("fill",fillStr);
		}
	});
}