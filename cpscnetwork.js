// Main variables
var width = window.innerWidth,
    height = 1500;
var filterWidth = width / 6,
	filterHeight = height;

var force;
var node, link; // nodes and links
var radius = 30;
var root; // hold svg element

var filter;

// remove links or low link strength

// Call methods
createVis();
// register event handlers
registerStreamButtonHandlers();
registerRequirementButtonHandlers();
registrerCreditButtonHandlers();
registrerLectureButtonHandlers();
registerLabButtonHandlers();
registerAvailabiltyButtonHandlers();
registerNodeHandlers();


// Create visualization
function createVis() {

	// set the dimensions of the filter pane
	d3.select("#filter")
			.attr("height", height);

	// set the dimensions of the graphics pane
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
		.charge(-radius * (radius * 1.5))
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
	    .attr("refX", radius)
	    .attr("refY", 0)
	    .attr("markerWidth", 6)
	    .attr("markerHeight",6)
	    .attr("viewBox", "-5 -5 10 10")
	    .attr("markerUnits", "strokeWidth")
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
		.attr("id", function (d) {
			return d.source.cid +  "" + d.target.cid;
		})
		.style("stroke-width", function (d) {
			// recommendations 
			if (d.value == 4 || d.value == 5) {
				return "5px";
			} else {
				return "2px";
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
		})
		.attr("data-toggle", 0);

	// hide anti-req and recommendations links
	toggleButtonAppearance(document.getElementById("avail"), 0);
	toggleButtonAppearance(document.getElementById("anti"), 0);
	toggleButtonAppearance(document.getElementById("rec"), 0);
	toggleButtonAppearance(document.getElementById("consent"), 0);

	d3.selectAll(".link-anti")
				.style("opacity", 0);
	
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


	// set button toggle state
	d3.selectAll(".button").attr("data-toggle", 0);

	// set button toggle state for credits, lectures, lab
	d3.selectAll(".radioButtonGroup").attr("data-toggle", 0);
	d3.select("#cred1").style("box-shadow", "0 4px rgb(254, 229, 217)");
	d3.select("#cred2").style("box-shadow", "0 4px rgb(252, 174, 145)");
	d3.select("#cred3").style("box-shadow", "0 4px rgb(251, 106, 74)");
	d3.select("#cred4").style("box-shadow", "0 4px rgb(184, 84, 80)");

	d3.select("#lec1").style("box-shadow", "0 4px rgb(242, 240, 247)");
	d3.select("#lec2").style("box-shadow", "0 4px rgb(203, 201, 226)");
	d3.select("#lec3").style("box-shadow", "0 4px rgb(158, 154, 200)");
	d3.select("#lec4").style("box-shadow", "0 4px rgb(117, 107, 177)");
	d3.select("#lec5").style("box-shadow", "0 4px rgb(84, 39, 143)");

	d3.select("#lab1").style("box-shadow", "0 4px rgb(254, 235, 226)");
	d3.select("#lab2").style("box-shadow", "0 4px rgb(251, 180, 185)");
	d3.select("#lab3").style("box-shadow", "0 4px rgb(247, 101, 161)");
	d3.select("#lab4").style("box-shadow", "0 4px rgb(197, 27, 138)");
	d3.select("#lab5").style("box-shadow", "0 4px rgb(122, 1, 119)");


	// setting infobox default visibilty
	var infoBoxDiv = document.getElementById("infoBox");
	infoBoxDiv.querySelector("#info-stream").style.display = "none";
	infoBoxDiv.querySelector("#info-availability").style.display = "none";
	infoBoxDiv.querySelector("#info-consent").style.display = "none";
	infoBoxDiv.querySelector("#info-level").style.display = "none";


	// create circles
	node.append("circle")
		.attr("class", "circle")
		.attr("r", radius)
		.attr("x", 0)
		.attr("y", 0)
		.style("fill", "white")
		.style("stroke-width", "2px")
		.style("stroke", "black")
		.attr("data-streamState", 0)
		.attr("data-toggle", 0)
		.attr("data-availState", 0);
		// add circles based off credits
		
	node.append("circle")
		.attr("class", "circle-credits")
		.attr("r", radius * 0.95)
		.attr("x", 0)
		.attr("y", 0)
		.style("fill", "transparent")
		.style("stroke-width", "2px")
		.style("stroke", "transparent")
		.attr("data-streamState", 0)
		.attr("data-toggle", 0)
		.attr("data-availState", 0);

	node.append("circle")
		.attr("class", "circle-lecture")
		.attr("r", radius * 0.85)
		.attr("x", 0)
		.attr("y", 0)
		.style("fill", "transparent")
		.style("stroke-width", "2px")
		.style("stroke", "transparent")
		.attr("data-streamState", 0)
		.attr("data-toggle", 0)
		.attr("data-availState", 0);

	node.append("circle")
		.attr("class", "circle-lab")
		.attr("r", radius * 0.75)
		.attr("x", 0)
		.attr("y", 0)
		.style("fill", "transparent")
		.style("stroke-width", "2px")
		.style("stroke", "transparent")
		.attr("data-streamState", 0)
		.attr("data-toggle", 0)
		.attr("data-availState", 0);

	// draw node text
	node.append("foreignObject")
		.attr("class", "text")
		.attr("x", -radius * 0.5)
 	 	.attr("y", -radius* 0.5)
		.html(function(d) { return "<p class=\"name\">" + d.faculty + "<br/>&nbsp;" + d.num + "</p>"; });

	// Hide the first node in courses since it is a NIL placeholder
	d3.select(".node").style("visibility", "hidden"); 

	// add onclick handlers for Availability 
	// to ensure non-overlapping ranges
	document.getElementById("startDate").addEventListener("click", function(d) {
		this.setAttribute("data-prevIndex", this.selectedIndex);
	});

	document.getElementById("startDate").addEventListener("change", function(d) {
		if (this.value > document.getElementById("endDate").value) {
			this.selectedIndex = this.getAttribute("data-prevIndex");
			return false;
		} else {
			updateAvailability(parseInt(document.getElementById("avail").getAttribute("data-toggle")) ? 1 : 0);
			return true;
		}
	});

	document.getElementById("endDate").addEventListener("click", function(d) {
		this.setAttribute("data-prevIndex", this.selectedIndex);
	});

	document.getElementById("endDate").addEventListener("change", function(d) {
		if (this.value < document.getElementById("startDate").value) {
			this.selectedIndex = this.getAttribute("data-prevIndex");
			return false;
		} else {
			updateAvailability(parseInt(document.getElementById("avail").getAttribute("data-toggle")) ? 1 : 0);
			return true;
		}
	});


	var focusHierarchyY = 
		[
			(height/5)*0.8,
			(height/5)*1.6,
			(height/5)*2.4,
			(height/5)*3.2,
			(height/5)*4,
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
	// FUTURE ITERATION: var focusScatter = [];

	var forceDamper = 0.5;
	var linksEnabled = true;
	var focusPull = false;

	var maxGroups = 5;

	// Reposition nodes and attributes based on position
  	force.on("tick", function(e) {

  		//if (true) {
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
  		//}

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

// Deprecated
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


function toggleButtonAppearance(obj, state) {

	if (state < 0) {
		state = parseInt(obj.getAttribute("data-toggle")) == 1 ? 0 : 1;
		obj.setAttribute("data-toggle", state);
	} 

	if(!state) {
		d3.select(obj)
						.transition()
						.duration(200)
						.style("background-color","rgb(255, 255, 255)")
	 					.style("color", "rgb(0, 0, 0)")
	 					.style("box-shadow", "0 4px rgb(0, 0, 0)")
	 					.style("top", "0")
	 					.text("Hidden");
	} else {
		d3.select(obj)
						.transition()
						.duration(200)
						.style("background-color","rgb(0, 0, 0)")
	 					.style("color", "rgb(255, 255, 255)")
	 					.style("box-shadow", "0 0 rgb(0, 0, 0)")
						.style("top", "5px")
	 					.text("Visible");
	}
	return state;
}

// Retrieves node style and returns an rgb color based off
// course stream and toggle state
function getNodeStyle(obj) {
	var streamState = parseInt(obj.getAttribute("data-streamState"));
	var isHighlighted = parseInt(obj.getAttribute("data-toggle"));

	if (isHighlighted) {
		return "rgb(249, 222, 99)";
	}

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

	var buttonState = parseInt(this.getAttribute("data-toggle"));
	var modifier = 0;

	// determine button state
	if(!buttonState) {
		modifier = 1;
		this.setAttribute("data-toggle", 1);
		d3.select(this)
						.transition()
						.duration(200)
						.style("background-color","rgb(0, 0, 0)")
	 					.style("color", "rgb(255, 255, 255)")
	 					.style("box-shadow", "0 0 rgb(0, 0, 0)")
	 					.style("top", "5px");

	 } else {
	 	modifier = -1;
	 	this.setAttribute("data-toggle", 0);
		d3.select(this)
						.transition()
						.duration(200)
						.style("background-color","rgb(255, 255, 255)")
	 					.style("color", "rgb(0, 0, 0)")
	 					.style("box-shadow", "0 4px rgb(0, 0, 0)")
	 					.style("top", "0");

	}
 	d3.selectAll(".circle").style("fill", function(d) {
		for(i=0; i < course2stream.length; i++) {
			if (d.cid == course2stream[i].cid && course2stream[i].cdid == streamID) {
					this.setAttribute("data-streamState", parseInt(this.getAttribute("data-streamState")) + modifier);
					return getNodeStyle(this);
			}	
		}
		return getNodeStyle(this);

		//return "rgb(255, 255, 255)";
	});

}

// Course Stream filter
function registerStreamButtonHandlers() {
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
function registerRequirementButtonHandlers() {
	d3.select("#anti").on("click", function(d) {
		var state = toggleButtonAppearance(this, -1) ? 1 : 0;

		// change visibility of .link-anti
		d3.selectAll(".link-anti")
							.transition()
							.duration(200)
							.style("opacity", function(d) {
								return state;
							})

	});

	d3.select("#rec").on("click", function(d) {
		var state = toggleButtonAppearance(this, -1) ? 1 : 0;

		// change visibility of .link-rec
		d3.selectAll(".link-rec")
							.transition()
							.duration(200)
							.style("opacity", function(d) {
								return state;
							})
	});

	d3.select("#consent").on("click", function(d) {
		var strokeWidth = toggleButtonAppearance(this, -1) ? "5px" : "2px";
		d3.selectAll(".node-consent > circle")
								.style("stroke-width", strokeWidth);
	});
}

function updateAvailability(state) {
	var startTime = document.getElementById("startDate").value;
	var endTime = document.getElementById("endDate").value;

	d3.selectAll(".circle").style("stroke-dasharray", function(d) {
	if (state) {
		for(i=0; i < availabilityMain.length; i++) {
			if (d.cid == availabilityMain[i].cid) {
				for (var k = 0; k < availabilityDetails.length; k++) {
					if (availabilityMain[i].aid == availabilityDetails[k].aid && 
						availabilityDetails[k].startstamp >= startTime && 
						availabilityDetails[k].startstamp <= endTime) {
							return "0,0";
					}
				}
			}	
		}
		return "5,10";
	} else {
		return "0,0";
	}
});
}

// Availability filter
function registerAvailabiltyButtonHandlers() {
	d3.select("#avail").on("click", function(d) {
		var state = toggleButtonAppearance(this, -1) ? 1 : 0;
	
		updateAvailability(state);

	});
}


function toggleRadioButtons(obj) {
	// find set button & unset
	var parent = obj.parentElement;
	for (var i = 0; i < parent.children.length; i++) {
		if (parseInt(parent.children[i].getAttribute("data-toggle"))) {
			//untoggle buttons
			d3.select(parent.children[i])
					.transition()
					.duration(200)
					.style("background-color","rgb(255, 255, 255)")
					.style("top", "0");
			parent.children[i].setAttribute("data-toggle", 0);
		} else if (obj == parent.children[i]) {
			//toggle selected button
			var bgColor = obj.style.boxShadow;
			d3.select(obj)
					.transition()
					.duration(200)
					.style("background-color", bgColor)
 					.style("top", "5px");
 			obj.setAttribute("data-toggle", 1);
		}
	}
}

//TODODODODODO
function DEPRECATED_NOT_WORKING(xx) {
	console.log(xx);
		toggleRadioButtons(this);
		var bgColor = this.style.boxShadow.split(")")[0] + ")";
		var state = parseInt(this.getAttribute("data-toggle"));
		d3.selectAll(".circle-credits").style("stroke", function (d) {
			console.log("tetet");
			// ignore cid=0 placeholder
			if (d.cid != 0) { 
				if (d.credit != 0.75 || !state) {
					return "transparent";
				} else {
					return bgColor;
				}
			}
		});
	}


// Credits filter
function registrerCreditButtonHandlers() {
	d3.select("#cred1").on("click", function (d) {
		toggleRadioButtons(this);
		var bgColor = this.style.boxShadow.split(")")[0] + ")";
		var state = parseInt(this.getAttribute("data-toggle"));
		d3.selectAll(".circle-credits").style("stroke", function (d) {
			// ignore cid=0 placeholder
			if (d.cid != 0) { 
				if (d.credit != 0.75 || !state) {
					return "transparent";
				} else {
					return bgColor;
				}
			}
		});
	});

	d3.select("#cred2").on("click", function (d) {
		toggleRadioButtons(this);
		var bgColor = this.style.boxShadow.split(")")[0] + ")";
		var state = parseInt(this.getAttribute("data-toggle"));
		d3.selectAll(".circle-credits").style("stroke", function (d) {
			// ignore cid=0 placeholder
			if (d.cid != 0) { 
				if (d.credit != 1.5 || !state) {
					return "transparent";
				} else {
					return bgColor;
				}
			}
		});
	});
	d3.select("#cred3").on("click", function (d) {
		toggleRadioButtons(this);
		var bgColor = this.style.boxShadow.split(")")[0] + ")";
		var state = parseInt(this.getAttribute("data-toggle"));
		d3.selectAll(".circle-credits").style("stroke", function (d) {
			// ignore cid=0 placeholder
			if (d.cid != 0) { 
				if (d.credit != 3 || !state) {
					return "transparent";
				} else {
					return bgColor;
				}
			}
		});	
	});
	d3.select("#cred4").on("click", function (d) {
		toggleRadioButtons(this);
		var bgColor = this.style.boxShadow.split(")")[0] + ")";
		var state = parseInt(this.getAttribute("data-toggle"));
		d3.selectAll(".circle-credits").style("stroke", function (d) {
			// ignore cid=0 placeholder
			if (d.cid != 0) { 
				if (d.credit != 6 || !state) {
					return "transparent";
				} else {
					return bgColor;
				}
			}
		});		
	});
}

// Lecture filter
function registrerLectureButtonHandlers() {
	d3.select("#lec1").on("click", function (d) {
		toggleRadioButtons(this);
		var bgColor = this.style.boxShadow.split(")")[0] + ")";
		var state = parseInt(this.getAttribute("data-toggle"));
		d3.selectAll(".circle-lecture").style("stroke", function (d) {
			// ignore cid=0 placeholder
			if (d.cid != 0) { 
				if (d.lecture != 1 || !state) {
					return "transparent";
				} else {
					return bgColor;
				}
			}
		});	
	});

	d3.select("#lec2").on("click", function (d) {
		toggleRadioButtons(this);
		var bgColor = this.style.boxShadow.split(")")[0] + ")";
		var state = parseInt(this.getAttribute("data-toggle"));
		d3.selectAll(".circle-lecture").style("stroke", function (d) {
			// ignore cid=0 placeholder
			if (d.cid != 0) { 
				if (d.lecture != 2 || !state) {
					return "transparent";
				} else {
					return bgColor;
				}
			}
		});	
	});

	d3.select("#lec3").on("click", function (d) {
		toggleRadioButtons(this);
		var bgColor = this.style.boxShadow.split(")")[0] + ")";
		var state = parseInt(this.getAttribute("data-toggle"));
		d3.selectAll(".circle-lecture").style("stroke", function (d) {
			// ignore cid=0 placeholder
			if (d.cid != 0) { 
				if (d.lecture != 3 || !state) {
					return "transparent";
				} else {
					return bgColor;
				}
			}
		});		
	});

	d3.select("#lec4").on("click", function (d) {
		toggleRadioButtons(this);
		var bgColor = this.style.boxShadow.split(")")[0] + ")";
		var state = parseInt(this.getAttribute("data-toggle"));
		d3.selectAll(".circle-lecture").style("stroke", function (d) {
			// ignore cid=0 placeholder
			if (d.cid != 0) { 
				if (d.lecture != 6 || !state) {
					return "transparent";
				} else {
					return bgColor;
				}
			}
		});	
	});
	d3.select("#lec5").on("click", function (d) {
		toggleRadioButtons(this);
		var bgColor = this.style.boxShadow.split(")")[0] + ")";
		var state = parseInt(this.getAttribute("data-toggle"));
		d3.selectAll(".circle-lecture").style("stroke", function (d) {
			// ignore cid=0 placeholder
			if (d.cid != 0) { 
				if (d.lecture != 12 || !state) {
					return "transparent";
				} else {
					return bgColor;
				}
			}
		});		
	});

}

// Lab filter
function registerLabButtonHandlers() {
	d3.select("#lab1").on("click", function (d) {
		toggleRadioButtons(this);
		var bgColor = this.style.boxShadow.split(")")[0] + ")";
		var state = parseInt(this.getAttribute("data-toggle"));
		d3.selectAll(".circle-lab").style("stroke", function (d) {
			// ignore cid=0 placeholder
			if (d.cid != 0) { 
				if (d.lab != 0 || !state) {
					return "transparent";
				} else {
					return bgColor;
				}
			}
		});		
	});

	d3.select("#lab2").on("click", function (d) {
		toggleRadioButtons(this);
		var bgColor = this.style.boxShadow.split(")")[0] + ")";
		var state = parseInt(this.getAttribute("data-toggle"));
		d3.selectAll(".circle-lab").style("stroke", function (d) {
			// ignore cid=0 placeholder
			if (d.cid != 0) { 
				if (d.lab != 1 || !state) {
					return "transparent";
				} else {
					return bgColor;
				}
			}
		});			
	});

	d3.select("#lab3").on("click", function (d) {
		toggleRadioButtons(this);
		var bgColor = this.style.boxShadow.split(")")[0] + ")";
		var state = parseInt(this.getAttribute("data-toggle"));
		d3.selectAll(".circle-lab").style("stroke", function (d) {
			// ignore cid=0 placeholder
			if (d.cid != 0) { 
				if (d.lab != 2 || !state) {
					return "transparent";
				} else {
					return bgColor;
				}
			}
		});				
	});

	d3.select("#lab4").on("click", function (d) {
		toggleRadioButtons(this);
		var bgColor = this.style.boxShadow.split(")")[0] + ")";
		var state = parseInt(this.getAttribute("data-toggle"));
		d3.selectAll(".circle-lab").style("stroke", function (d) {
			// ignore cid=0 placeholder
			if (d.cid != 0) { 
				if (d.lab != 3 || !state) {
					return "transparent";
				} else {
					return bgColor;
				}
			}
		});			
	});

	d3.select("#lab5").on("click", function (d) {
		toggleRadioButtons(this);
		var bgColor = this.style.boxShadow.split(")")[0] + ")";
		var state = parseInt(this.getAttribute("data-toggle"));
		d3.selectAll(".circle-lab").style("stroke", function (d) {
			// ignore cid=0 placeholder
			if (d.cid != 0) { 
				if (d.lab != 5 || !state) {
					return "transparent";
				} else {
					return bgColor;
				}
			}
		});				
	});
}


function toggleInfoPane(obj, data, state) {
	var infoBoxD3 = d3.select("#infoBox");
	var infoBoxDiv = document.getElementById("infoBox");
	
	// CNUM
	infoBoxDiv.querySelector("#info-cnum").innerText = data.cnum;
	
	// CNAME
	infoBoxDiv.querySelector("#info-cname").innerText = data.cname;

	// COURSE STREAM
	var tmp = d3.selectAll(".stream-button")[0];
	infoBoxDiv.querySelector("#info-stream").style.display = "none";
	for (var i = 0; i < tmp.length; i++) {
		if (parseInt(tmp[i].getAttribute("data-toggle"))) {
			infoBoxDiv.querySelector("#info-stream").style.display = "block";
			break;
		}
	}

	var infoBoxStream = infoBoxDiv.querySelector("#info-stream").children[1];
	// clear existing stream list elements
	while (infoBoxStream.firstChild) {
    	infoBoxStream.removeChild(infoBoxStream.firstChild);
	}
	for(var i=0; i < course2stream.length; i++) {
		if (data.cid == course2stream[i].cid) {
			var el = document.createElement("li");
			el.innerText = degDetails[course2stream[i].cdid].type;
			infoBoxStream.appendChild(el);

		}
	}
	if (!infoBoxStream.firstChild) 
		 infoBoxStream.innerHTML = "<i>None</i>";


	// AVAILABILITY
	if (parseInt(document.getElementById("avail").getAttribute("data-toggle"))) {
		infoBoxDiv.querySelector("#info-availability").style.display = "block";
	} else {
		infoBoxDiv.querySelector("#info-availability").style.display = "none";
	}

	var infoBoxAvailability = infoBoxDiv.querySelector("#info-availability").children[1];
	// clear existing availability list elements
	while (infoBoxAvailability.firstChild) {
    	infoBoxAvailability.removeChild(infoBoxAvailability.firstChild);
	}
	for (var i = 0; i < availabilityMain.length; i++) {
		if (data.cid == availabilityMain[i].cid) {
			var el = document.createElement("li");
			el.innerText = availabilityDetails[availabilityMain[i].aid].semester;
			infoBoxAvailability.appendChild(el);
		}
 	}
	
	// CONSENT
	if (parseInt(document.getElementById("consent").getAttribute("data-toggle"))) {
		infoBoxDiv.querySelector("#info-consent").style.display = "block";
	} else {
		infoBoxDiv.querySelector("#info-consent").style.display = "none";
	}

	var infoBoxConsent = infoBoxDiv.querySelector("#info-consent").children[0];
	if (data.consent != "") {
		infoBoxConsent.innerText = "Consent required by: " + data.consent;
	} else {
		infoBoxConsent.innerHTML = "Consent required by: <i>None</i>";
	}


	// SENIORITY
	// TODO




	// Show/Hide infoDiv + positioning
	infoBoxD3.attr("height", "auto")
		.style("left", (data.x + 15) + "px")
		.style("top", (data.y - 30) + "px");
	if (state) {
			infoBoxD3.style("visibility", "visible")
				.transition()
				.duration(200)
				.style("opacity", 1);
		} else {
			infoBoxD3.style("visibility", "hidden")
				.transition()
				.duration(200)
				.style("opacity", 0);
		}

}


function toggleNode(obj) {
	if(obj.getAttribute("data-toggle") == 0) {
		obj.setAttribute("data-toggle", 1);
	} else {
		obj.setAttribute("data-toggle", 0);
	}
	return obj.getAttribute("data-toggle");
}

function toggleAvail(obj) {
	if(obj.getAttribute("data-availState") == 0) {
		obj.setAttribute("data-availState", 1);
	} else {
		obj.setAttribute("data-availState", 0);
	}
	return obj.getAttribute("data-availState");
}


// node: node being affected
// state: end-state of node
function toggleLinks(node, data, state) {
	// gather links associated with node
	// for each link associated with a node,
	// add or minus 1 from the link-toggle state
	// then  update appearance of link to match the 
	// new link-toggle state (>0 highlighted)
	for (i=0; i< cpscgraph.links.length; i++) { 
		if (cpscgraph.links[i].source.cid == data.cid || 
			cpscgraph.links[i].target.cid == data.cid){	
			var id = cpscgraph.links[i].source.cid + "" + cpscgraph.links[i].target.cid;
			var obj = document.getElementById(id);
			obj.setAttribute("data-toggle", parseInt(obj.getAttribute("data-toggle")) + (parseInt(state) ? 1 : -1));

			if(parseInt(obj.getAttribute("data-toggle")) < 0 ||
				parseInt(obj.getAttribute("data-toggle")) > 2) {
				
				console.log("ASSERTION ERROR [" + obj.id + "]: link-toggle outside of range (" + parseInt(obj.getAttribute("data-toggle")) + ")");
				return;
			}

			// update appearance
			if (parseInt(obj.getAttribute("data-toggle")) > 0) {
				d3.select(obj).style("stroke-opacity", "1");
			} else {
				d3.select(obj).style("stroke-opacity", "0.3");
			}
		}
	}
}
	
// Hover/select interaction makes nodes highlighted
// TODO: make associated links highlighted
function registerNodeHandlers() {
	// highlight circles
	d3.selectAll(".circle").on("mouseover", function(d) {
		if (this.getAttribute("data-toggle") == 0) {
			d3.select(this).style("stroke", "rgb(249, 222, 99)")
							.style("fill","rgb(249, 222, 99)");
		}
		toggleInfoPane(this, d, true);
	});


	// unhighlight circles
	d3.selectAll(".circle").on("mouseleave", function(d) {
		var fillStr = getNodeStyle(this);

		if (this.getAttribute("data-toggle") == 0) {
			d3.select(this).style("stroke", "rgb(0, 0, 0)")
							.style("fill",fillStr);
		}
		toggleInfoPane(this, d, false);
	}); 

	
	// toggle circle highlighting
	d3.selectAll(".circle").on("click", function(d) {
		var newState = toggleNode(this);
		toggleLinks(this, d, newState);	
	});

	d3.selectAll("foreignObject").on("click", function(d) {
		var newState = toggleNode(this.parentElement.firstChild);
		toggleLinks(this.parentElement.firstChild, d, newState);	
	});

	d3.selectAll("foreignObject").on("mouseover", function(d) {
		d3.select(this.parentElement.firstChild).style("stroke", "rgb(249, 222, 99)")
										.style("fill","rgb(249, 222, 99)");
		toggleInfoPane(this.parentElement.firstChild, d, true);
	});

	d3.selectAll("foreignObject").on("mouseleave", function(d) {
		var fillStr = getNodeStyle(this.parentElement.firstChild);

		if (this.parentElement.firstChild.getAttribute("data-toggle") == 0) {
			d3.select(this.parentElement.firstChild).style("stroke", "rgb(0, 0, 0)")
											.style("fill",fillStr);
		}

		toggleInfoPane(this.parentElement.firstChild, d, false);
	});
}