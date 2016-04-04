var width = 960,
    height = 960;

// color nodes based off groups
var color = d3.scale.category20();

var force; // control force layout
var node, link; // nodes and links

var forceDamper = 0.2;

var linksEnabled = true;
var focusPull = false;

var root; // hold svg element

var foci = [];
	
createVis();
createButtons();

// bind data into force layout
function createVis() {
	// each node a radius - necessary for collision detection code
	_.each(graph.nodes, function(d) {
		d.radius = 10;
	});

	// select graphics id, set width and height
	root = d3.select("#graphics")
		.attr("width", width)
		.attr("height", height);

	// layout, change properties to influence layout
	force = d3.layout.force()
		.charge(-120) // repel
		.linkDistance(function (d) {
			return Math.random() * 50;
		}) // optimal distance between nodes
		.gravity(0.1) // larger number, more pull to center
		.friction(0.9) // how mobile does it move - force pulling nodes
		.size([width, height]);
		
	force
		.nodes(graph.nodes) // pass graph var from miserables
		.links(graph.links)
		.start(); // start simulation

	// use root svg, select links, bind data
	// append lines, change class to link and stroke/opacity based off value
	var link = root.selectAll(".link")
		.data(graph.links)
		.enter().append("line")
		.attr("class", "link")
		.style("stroke-width", function(d) { return Math.sqrt(d.value); });

	var node = root.selectAll(".node")
		.data(graph.nodes)
		.enter().append("circle")
		.call(force.drag) // for each node, function handles events - drag the nodes
		.attr("class", "node")
		.attr("r", 5)
		.style("fill", function(d) { return color(d.group); }); // color scale defined at top

	node.append("title")
		.text(function(d) { return d.name; });
		
//* focus
	// definie focus locations - find max groups, iterate through all
	// for each, divide angle and take the whole circle and multiply by some ratio
	// 0.5 factor helps move into center
	var maxGroups = d3.max(graph.nodes, function(d) { return d.group; });
	for (var i = 0; i <= maxGroups; i++) {
		foci.push({
			x: 0.5 * Math.cos(2 * Math.PI * i / maxGroups) + 0.5,
			y: 0.5 * Math.sin(2 * Math.PI * i / maxGroups) + 0.5
		});
	}
//*/

	// For every tick event, reposition nodes and attributes based on position
	// previous calculations calculated x,y points
	// change position of circles and lines to see simulation running (x1,x2,y1,y2)
	force.on("tick", function(e) {
	//* focus pulling - similar to links enabled
		if (focusPull) {
			// modify target position of nodes 
			// create a quadtree from the post view objects
			//var q = d3.geom.quadtree(graph.nodes);

			// take current position of node, difference simulation with some damper
			// focus array comes into play 
			// each node has group id, need to multiply by width and height
			// foceDamper is coefficient that modifies how powerful attraction is 
			_.each(graph.nodes, function(d) {
				d.x = d.x + (foci[d.group].x * width - d.x) * forceDamper * e.alpha;
				d.y = d.y + (foci[d.group].y * height - d.y) * forceDamper * e.alpha;

				q.visit(collide(d), 1.1);
			});

			_.each(graph.nodes, function(d) {
			});
		}
	//*/
	
		// combines links to node in correct position
		link.attr("x1", function(d) { return d.source.x; })
			.attr("y1", function(d) { return d.source.y; })
			.attr("x2", function(d) { return d.target.x; })
			.attr("y2", function(d) { return d.target.y; });

		node.attr("cx", function(d) { return d.x; })
			.attr("cy", function(d) { return d.y; });
	});
 
	//d3.timer(function() { force.start(); return false; }); // keeps the force layout running without any decay
}

function createButtons() {
	var buttons = d3.select("#buttons");
	
	// Add span elements to the current button div
	buttons.append("span")
		.attr("class", "button")
		.on("click", function() { // links disappear, nodes float wherever
			linksEnabled = !linksEnabled;
			
			if (linksEnabled) {
				force.links(graph.links).start();
				d3.selectAll(".link").style("visibility", "visible");
			} else {
				force.links([]).start();
				d3.selectAll(".link").style("visibility", "hidden");
			}
		})
		.html("Turn on/off Links");

	buttons.append("span")
		.attr("class", "button")
		.on("click", function() {
			focusPull = !focusPull;
			//force.start(); //restarts simulation when you click
		})
		.html("Pull to Focus");
}

// collision detection function that is used by the forcelayout.tick event
function collide(node, radiusBuffer) {
	radiusBuffer = (typeof radiusBuffer === 'undefined') ? 1.0 : radiusBuffer;
	var r = node.radius * radiusBuffer,
		nx1 = node.x - r,
		nx2 = node.x + r,
		ny1 = node.y - r,
		ny2 = node.y + r;
	return function(quad, x1, y1, x2, y2) {
		if (node.charge && quad.point && quad.point.charge && (quad.point !== node)) {
			var x = node.x - quad.point.x,
				y = node.y - quad.point.y,
				l = Math.sqrt(x * x + y * y),
				r = node.radius + quad.point.radius;
			if (l < r) {
				l = (l - r) / l * .5;
				node.x -= x *= l;
				node.y -= y *= l;
				quad.point.x += x;
				quad.point.y += y;
			}
		}
		return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
	};
}






