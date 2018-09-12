'use strict';

// Location of data files
const trialsFile = "./data/experiments.csv"
const menuL1File = "./data/menu_depth_1.csv"
const menuL2File = "./data/menu_depth_2.csv"
const menuL3File = "./data/menu_depth_3.csv"
const maxAttempt = 3

// Global variables
var menu;
var trialsData = [];
var numTrials = 0;
var currentTrial = 1;
var markingMenuL1 = [];
var markingMenuL2 = [];
var markingMenuL3 = [];
var radialMenuTree = null;
var radialMenuL1 = [];
var radialMenuL2 = [];
var radialMenuL3 = [];
var tracker = new ExperimentTracker();
var markingMenuSubscription = null;
var radialMenuSvg = null;
var attempt = 0

// Code to get participantID
function getUrlParameter(name) {
	name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
	var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
	var results = regex.exec(location.search);
	return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
};

var participantID = JSON.parse(localStorage.getItem('preQ')).participantID
// var participantID = getUrlParameter("participantID")
console.log('participantID: ', participantID);

// Code for measuring distance
var isDistTracking = false
var curDist = 0
var prevPos = { x: null, y: null }

// document.addEventListener('mousemove', onMouseUpdate, false);

function startDistTracking(e) {
	isDistTracking = true
	curDist = 0
	// console.log('e.clientX: ', e.clientX);
	// console.log('e.clientY: ', e.clientY);
	prevPos.x = e.clientX
	prevPos.y = e.clientY
}

$(document).mousemove(function (event) {
	if (isDistTracking) {
		curDist += Math.sqrt(Math.pow(prevPos.y - event.clientY, 2) + Math.pow(prevPos.x - event.clientX, 2));
		prevPos.x = event.clientX;
		prevPos.y = event.clientY;
		// console.log('movingDist: ', curDist);
	}
});

function stopDistTracking() {
	console.log('curDist: ', curDist);
	var tempDist = curDist
	isDistTracking = false
	curDist = 0
	prevPos.x = null
	prevPos.y = null
	return tempDist
}


// Load CSV files from data and return text
function getData(relativePath) {
	var xmlHttp = new XMLHttpRequest();
	xmlHttp.open("GET", relativePath, false);
	xmlHttp.send(null);
	return xmlHttp.responseText;
}
var radialJsonMenu = {}
var markingJsonMenu = {}

function getMenus() {
	// breadth+depth
	var configList = [[2, 1], [2, 2], [2, 3], [4, 1], [4, 2], [4, 3], [6, 1], [6, 2], [6, 3],]
	configList.forEach(config => {
		var curMenu = getData("./data/menu" + config[0] + "_" + config[1] + ".csv")
		var key = config[0] + "" + config[1]
		markingJsonMenu[key] = formatMarkingMenuData(curMenu)
		radialJsonMenu[key] = formatRadialMenuData(curMenu)
	})
}


// Loads the CSV data files on page load and store it to global variables
function initExperiment() {

	// Get Trails
	// var data = getData(trialsFile);
	var data = getData("./data/experiments" + participantID + ".csv");

	var records = data.split("\n");
	numTrials = records.length - 1;
	for (var i = 1; i <= numTrials; i++) {
		var cells = records[i].split(",");
		var menuType = cells[2].trim();
		var menuBreadth = cells[3].trim();
		var menuDepth = cells[4].trim();
		var targetItem = cells[5].trim();
		trialsData[i] = {
			'Menu Type': menuType,
			'Menu Depth': menuDepth,
			'Target Item': targetItem,
			'Menu Breadth': menuBreadth
		};
	}

	// Get Menus
	var menuL1Data = getData(menuL1File);
	var menuL2Data = getData(menuL2File);
	var menuL3Data = getData(menuL3File);

	// Format CSV Menu to respective Menu structures
	markingMenuL1 = formatMarkingMenuData(menuL1Data);
	markingMenuL2 = formatMarkingMenuData(menuL2Data);
	markingMenuL3 = formatMarkingMenuData(menuL3Data);
	radialMenuL1 = formatRadialMenuData(menuL1Data);
	radialMenuL2 = formatRadialMenuData(menuL2Data);
	radialMenuL3 = formatRadialMenuData(menuL3Data);

	getMenus()

	//Start the first trial
	nextTrial();
}

// Wrapper around nextTrial() to prevent click events while loading menus
function loadNextTrial(e) {
	e.preventDefault();
	nextTrial();

}

function recurMarkingWidth(newObj, limitWidth) {
	while (newObj.length > limitWidth) {
		newObj.splice(limitWidth, 1)
	}
	for (var i = 0; i < newObj.length; i++) {
		if (newObj[i].children.length > 0) {
			newObj[i].children = recurMarkingWidth(newObj[i].children, limitWidth)
		}
	}
	return newObj
}

function genMarkingWidth(obj, limitWidth) {
	var newObj = JSON.parse(JSON.stringify(obj))
	newObj = recurMarkingWidth(newObj, limitWidth)
	return newObj
}

function recurRadialWidth(newObj, limitWidth) {
	while (newObj.length > limitWidth) {
		newObj.splice(limitWidth, 1)
	}
	for (var i = 0; i < newObj.length; i++) {
		if (newObj[i]._children && newObj[i]._children.length > 0) {
			newObj[i]._children = recurRadialWidth(newObj[i]._children, limitWidth)
		} else {
			newObj[i]['callback'] = radialMenuOnSelect
		}

	}
	return newObj
}

function genRadialWidth(obj, limitWidth) {
	var newObj = JSON.parse(JSON.stringify(obj))
	newObj._children = recurRadialWidth(newObj._children, limitWidth)
	return newObj
}
// Move to next trai and record events
function nextTrial() {


	if (currentTrial <= numTrials) {
		attempt = 0

		var menuType = trialsData[currentTrial]['Menu Type'];
		var menuDepth = trialsData[currentTrial]['Menu Depth'];
		var targetItem = trialsData[currentTrial]['Target Item'];
		var menuBreadth = trialsData[currentTrial]['Menu Breadth'];

		document.getElementById("trialNumber").innerHTML = String(currentTrial) + "/" + String(numTrials);
		document.getElementById("menuType").innerHTML = menuType;
		document.getElementById("menuDepth").innerHTML = menuDepth;
		document.getElementById("menuBreadth").innerHTML = menuBreadth;
		document.getElementById("targetItem").innerHTML = targetItem;
		document.getElementById("selectedItem").innerHTML = "&nbsp;";

		document.getElementById("attempt").innerHTML = attempt + "/" + maxAttempt;

		document.getElementById("nextButton").disabled = true
		// Set IV3 state over here

		tracker.newTrial();
		tracker.trial = currentTrial;
		tracker.menuType = menuType;
		tracker.menuDepth = menuDepth;
		tracker.menuBreadth = menuBreadth
		tracker.targetItem = targetItem;

		if (menuType === "Marking") {

			initializeMarkingMenu();

			// if (menuDepth == 1) {
			// 	menu = MarkingMenu(markingMenuL1, document.getElementById('marking-menu-container'));
			// 	// menu = MarkingMenu(genMarkingWidth(markingMenuL1,menuBreadth), document.getElementById('marking-menu-container'));
			// }
			// else if (menuDepth == 2) {
			// 	menu = MarkingMenu(markingMenuL2, document.getElementById('marking-menu-container'));
			// 	// menu = MarkingMenu(genMarkingWidth(markingMenuL2,menuBreadth), document.getElementById('marking-menu-container'));
			// } else if (menuDepth == 3) {
			// 	menu = MarkingMenu(markingMenuL3, document.getElementById('marking-menu-container'));
			// 	// menu = MarkingMenu(genMarkingWidth(markingMenuL3,menuBreadth), document.getElementById('marking-menu-container'));
			// }
			var key = menuBreadth + "" + menuDepth
			menu = MarkingMenu(markingJsonMenu[key], document.getElementById('marking-menu-container'));

			markingMenuSubscription = menu.subscribe((selection) => markingMenuOnSelect(selection));

			$("#help").html("Click in the yellow box to access menu. (Optional)You can try stroking the along the path of the option to select it.");
		} else if (menuType === "Radial") {

			initializeRadialMenu();
			var key = menuBreadth + "" + menuDepth
			menu = createRadialMenu(radialJsonMenu[key]);
			// if (menuDepth == 1) {
			// 	menu = createRadialMenu(radialMenuL1);
			// 	// menu = createRadialMenu(genRadialWidth(radialMenuL1,menuBreadth));
			// }
			// else if (menuDepth == 2) {
			// 	menu = createRadialMenu(radialMenuL2);
			// 	// menu = createRadialMenu(genRadialWidth(radialMenuL2,menuBreadth));
			// } else if (menuDepth == 3) {
			// 	menu = createRadialMenu(radialMenuL3);
			// 	// menu = createRadialMenu(genRadialWidth(radialMenuL3,menuBreadth));
			// }

			$("#help").html("Click in the yellow box to access menu.");
		}

		currentTrial++;
	} else {

		var nextButton = document.getElementById("nextButton");
		nextButton.innerHTML = "Done";
		tracker.toCsv();
		window.location = "./post-questionaire.html"
	}
}





/*Functions related to MarkingMenu*/

// Reconstructs marking menu container
function initializeMarkingMenu() {

	//Unload Radial Menu
	var radialMenuContainer = document.getElementById('radial-menu-container');
	if (radialMenuContainer != null) {
		radialMenuContainer.parentNode.removeChild(radialMenuContainer);
	}

	// Load Marking Menu
	var interactionContainer = document.getElementById('interaction-container');
	if (markingMenuSubscription != null) {
		markingMenuSubscription.unsubscribe();
	}
	var markingMenuContainer = document.getElementById('marking-menu-container');
	if (markingMenuContainer == null) {
		interactionContainer.innerHTML += "<div id=\"marking-menu-container\" style=\"height:100%;width:100%\" onmousedown=\"markingMenuOnMouseDown(event)\" oncontextmenu=\"preventRightClick(event)\"></div>";
	}
}

//Formats csv menu data in the structure accepted by radial menu
// Assumes menu csv is sorted by Id and Parent both Ascending
function formatMarkingMenuData(data) {
	var records = data.split("\n");
	var numRecords = records.length;
	var menuItems = {}

	// Parse through the records and create individual menu items
	for (var i = 1; i < numRecords; i++) {
		var items = records[i].split(',');
		var id = items[0].trim();
		var label = items[2].trim();
		menuItems[id] = {
			'name': label,
			'children': []
		};
	}

	for (var i = numRecords - 1; i >= 1; i--) {
		var items = records[i].split(',');
		var id = items[0].trim();
		var parent = items[1].trim();
		if (parent === '0') {
			continue;
		} else {
			var children = menuItems[parent]['children'];
			children.push(menuItems[id]);
			delete menuItems[id]
			menuItems[parent]['children'] = children;
		}
	}

	var menuItemsList = [];
	for (var key in menuItems) {
		menuItemsList.push(menuItems[key]);
	}

	return menuItemsList;
}

// Function to start tracking timer on mouse down
function markingMenuOnMouseDown(e) {
	tracker.startTimer();
	startDistTracking(e)
}

//Function to start tracking timer on mouse down
function markingMenuOnSelect(selectedItem) {
	curDist = stopDistTracking()
	tracker.recordSelectedItem(selectedItem.name, curDist);
	attempt += 1
	if (attempt >= maxAttempt) {
		$("#help").html("You can click on the next button to proceed.");
		document.getElementById("nextButton").disabled = false
	}
	if (attempt <= maxAttempt) {
		document.getElementById("attempt").innerHTML = attempt + "/" + maxAttempt;
		document.getElementById("selectedItem").innerHTML = selectedItem.name;
	}
	if ( currentTrial>= 9) {
		$("#help").html("You can click on the next button to proceed.Remember to take breaks and drink water");
	}
}

function preventRightClick(e) {
	e.preventDefault();
}


/*Functions related to RadialMenu*/

// Reconstructs radial menu container
function initializeRadialMenu() {

	// Unload Marking Menu
	if (markingMenuSubscription != null) {
		markingMenuSubscription.unsubscribe();
	}
	var markingMenuContainer = document.getElementById('marking-menu-container');
	if (markingMenuContainer != null) {
		markingMenuContainer.parentNode.removeChild(markingMenuContainer);
	}



	// Reload Radial Menu
	var interactionContainer = document.getElementById('interaction-container');
	var radialMenuContainer = document.getElementById('radial-menu-container');
	if (radialMenuContainer == null) {
		interactionContainer.innerHTML += "<div id=\"radial-menu-container\" style=\"height:100%;width:100%\" onclick=\"toggleRadialMenu(event)\"></div>";
		// interactionContainer.innerHTML += "<div id=\"radial-menu-container\" style=\"height:100%;width:100%\" oncontextmenu=\"toggleRadialMenu(event)\"></div>";
	}
	document.getElementById("radial-menu-container").onclick = toggleRadialMenu
}

// Create radial menu svg element
function createRadialMenu(radialMenuL) {

	var radialmenuElement = document.getElementById('radialmenu');
	if (radialmenuElement != null) {
		radialmenuElement.parentNode.removeChild(radialmenuElement);
	}


	var w = window.innerWidth;
	var h = window.innerHeight;
	var radialMenuSvgElement = document.getElementById('radial-menu-svg');
	if (radialMenuSvgElement != null) {
		radialMenuSvgElement.parentNode.removeChild(radialMenuSvgElement);
	}
	radialMenuSvg = d3.select("#radial-menu-container").append("svg").attr("width", w).attr("height", h).attr("id", "radial-menu-svg");
	radialMenuTree = radialMenuL;
	return radialMenuSvg;
}

// Toggle radial menu on right click
function toggleRadialMenu(e) {
	console.log('e.clientX: ', e.clientX);
	console.log('e.clientY: ', e.clientY);

	if (tracker.startTime == null) {

		if (radialMenuTree != null) {
			// $("radial-menu-container").prop("onclick", null).off("click");
			menu = module.exports(radialMenuTree, {
				x: parseFloat(e.clientX),
				y: parseFloat(e.clientY)
			}, radialMenuSvg);

			document.getElementById("radial-menu-container").onclick = function () { return false }
			// Start timing once menu appears
			tracker.startTimer();
			startDistTracking(e)
		}
	} else {

		// Record previous item
		tracker.recordSelectedItem(null, null);

		if (radialMenuTree != null) {

			// document.getElementById("radial-menu-container").removeEventListener('click',toggleRadialMenu,false)

			menu = module.exports(radialMenuTree, {
				x: parseFloat(e.clienX),
				y: parseFloat(e.clientY)
			}, radialMenuSvg);

			document.getElementById("radial-menu-container").onclick = function () { return false }
			// Start timing once menu appears
			tracker.startTimer();
			startDistTracking(e)
		}
	}
	e.preventDefault();
}

//Callback for radialmenu when a leaf node is selected
function radialMenuOnSelect() {

	curDist = stopDistTracking()
	tracker.recordSelectedItem(this.id, curDist);
	var radialmenu = document.getElementById('radialmenu');
	radialmenu.parentNode.removeChild(radialmenu);

	// document.getElementById("selectedItem").innerHTML = this.id;
	attempt += 1
	if (attempt >= maxAttempt) {
		document.getElementById("nextButton").disabled = false
	}
	if (attempt <= maxAttempt) {
		document.getElementById("attempt").innerHTML = attempt + "/" + maxAttempt;
		document.getElementById("selectedItem").innerHTML = this.id;
		// document.getElementById("radial-menu-container").addEventListener("click",toggleRadialMenu,false)
		document.getElementById("radial-menu-container").onclick = toggleRadialMenu
	}
}

//Formats csv menu data in the structure accepted by radial menu
// Assumes menu csv is sorted by Id and Parent both Ascending
function formatRadialMenuData(data) {

	var records = data.split("\n");
	var numRecords = records.length;
	var menuItems = {}



	// Parse through the records and create individual menu items
	for (var i = 1; i < numRecords; i++) {
		var items = records[i].split(',');
		var id = items[0].trim();
		var label = items[2].trim();
		menuItems[id] = {
			'id': label,
			'fill': "#39d",
			'name': label,
			'_children': []
		};
	}

	for (var i = numRecords - 1; i >= 1; i--) {
		var items = records[i].split(',');
		var id = items[0].trim();
		var parent = items[1].trim();
		if (parent === '0') {
			continue;
		} else {
			var _children = menuItems[parent]['_children'];
			if (menuItems[id]['_children'].length == 0) {
				menuItems[id]['callback'] = radialMenuOnSelect;
			}
			_children.push(menuItems[id]);
			delete menuItems[id];
			menuItems[parent]['_children'] = _children;
		}
	}


	var menuItemsList = [];
	for (var key in menuItems) {
		if (menuItems[key]['_children'].length == 0) {
			delete menuItems[key]['_children'];
			menuItems[key]['callback'] = radialMenuOnSelect;
		} else {
			delete menuItems[key]['callback'];
		}
		menuItemsList.push(menuItems[key]);
	}

	return {
		'_children': menuItemsList
	};

}

// To check radial listener
// getEventListeners(document.getElementById("radial-menu-container")).click[0].listener