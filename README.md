# CPSC-Degree
An interactive visualization helping University of Calgary staff and students better understand the Computer Science degree.

Interested in the design process? Read the [case study](https://medium.com/@missCarrieMah/understanding-degrees-through-better-visualizations-fec3319b7daa)

## Instructions on how to run:
* Downloaded: Run `cpscnetwork.html` on Google Chrome 
* Online: Go to http://misscarriemah.github.io/CPSC-Degree/ - optimal on Google Chrome & a desktop

## Creating the database
I created a data set based on relevant courses from January 2016:

* [Undergraduate SENG courses](http://www.ucalgary.ca/pubs/calendar/current/software-engineering.html)
* [Undergraduate CPSC courses](http://www.ucalgary.ca/pubs/calendar/current/computer-science.html) except for CPSC 203 as BSc students receive no credit
* Courses in the [Computer Science degree](http://www.ucalgary.ca/pubs/calendar/current/sc-4-3-1.html) except outside the CPSC field, irrelevant Honours & MATH (e.g. PMAT 527), ENCM & EENG, and Scientific Computation (which was undergoing review)
* Excluded graduate courses and pre-requisite high school courses
* Selected the last 4 academic years for Fall, Winter, Spring, and Summer courses between Fall 2012 and Spring 2016 ([CPSC](http://contacts.ucalgary.ca/info/cpsc/courses), [MATH](http://contacts.ucalgary.ca/info/math/courses), [PHIL](http://contacts.ucalgary.ca/info/phil/courses))
* Classified courses as optional if a pre-requisite is met with class A or B and required otherwise
* Converted course links to [conjunctive normal form](https://en.wikipedia.org/wiki/Conjunctive_normal_form) for consistent relationships

## Understanding the data files
Interested in using the database? Read more about it here: 

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
