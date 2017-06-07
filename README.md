# CPSC-Degree
An Information Visualization project on the UofC CPSC Degree

* Downloaded: Run cpscnetwork.html on Google Chrome 
* Online: Go to http://misscarriemah.github.io/CPSC-Degree/

## Data
Interested in using the database? Read more about it here: https://medium.com/@missCarrieMah/understanding-degrees-through-better-visualizations-fec3319b7daa

### [cpscdata.js](https://github.com/missCarrieMah/CPSC-Degree/blob/master/data/cpscdata.js)
There are two main structures in the "cpscgraph" variable

**"courses"** - first entry is a nil placeholder to render the graph properly

* **`cid`**: *integer*, unique identifier for the node
* **`faculty`**: *string*, four-letter faculty relevant to CPSC
* **`num`**: *integer*, course number
* **`cnum`**: *string*, combination of faculty + num
* **`cname`**: *string*, full course name
* **`consent`**: *string*, where you'll need consent from (Department of...)
* **`credit/lecture/lab`**: *integer*, corresponds with their names
* **`did`**: *integer*, unused - see details.js

**"links"** - used as relationships for courses
* **`source/target`**: *integer*, corresponds with `cid` in courses structure
* **`value`**: *integer*, helps create the links (you're spot on)
* **`0/1`**: source is a prereq for target, 0 has an "AND" relationship and 1 has an "OR" relationship
* **`2/3`**: source is an antireq for target, 2 has an "AND" relationship and 3 has an "OR" relationship
* **`4/5`**: source is recommended for targe, 4 has an "AND" relationship and 5 has an "OR" relationship

### [details.js](https://github.com/missCarrieMah/CPSC-Degree/blob/master/data/details.js)
There are three structures

**"course2stream"** - connects courses & concentration stream
* **`cid`**: integer, corresponds with cid in cpscgraph.courses
* **`cdid`**: key to degDetails structure

**"degDetails"** - list of concentrations (0 = none)
* **`cdid`**: integer, unique key with course2stream
* **`type`**: string, for concentration name

**"availabilityMain"** - connects courses & when courses were offered (should be called course2availability for consistency)
* **`cid`**: integer, corresponds with cid in cpscgraph.courses
* **`aid`**: string, key to availabilityDetails structure

**"availabilityDetails"** - semester & year when courses were offered in the past
* **`aid`**: integer, unique key with availabilityMain
* **`startstamp`**: integer, unique number used for error handling with the filters (cannot select years that aren't a range)
* **`semester`**: string, for semester name
