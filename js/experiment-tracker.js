// Class used to track experiment
class ExperimentTracker {


	constructor() {
		this.trials = [];
		this.attempt = 0;
		this.trial = null;
		this.attempt = null;
		this.menuType = null;
		this.menuDepth = null;
		this.targetItem = null;
		this.selectedItem = null;
		this.startTime = null;
		this.endTime = null;
	}
	
	resetTimers(){
		this.startTime = null;
		this.endTime = null;
	}

	startTimer() {
		this.startTime = Date.now();
	}

	recordSelectedItem(selectedItem) {
		this.selectedItem = selectedItem;
		this.stopTimer();
	}

	stopTimer() {
		
		this.endTime = Date.now();
		// this.trials.push([this.trial, this.attempt, this.menuType, this.menuDepth, this.targetItem, this.selectedItem, this.startTime, this.endTime])
		this.trials.push([this.trial, this.attempt, this.menuType, this.menuDepth, this.targetItem, this.selectedItem, this.startTime, this.endTime, this.endTime-this.startTime])
		this.resetTimers();
		this.attempt++;

	}

	newTrial() {
		this.attempt = 1;
	}

	toCsv() {
		// var csvFile = "Trial,Attempt,Menu Type,Menu Depth,Target Item,Selected Item,Start Time, End Time\n";
		var csvFile = "Trial,Attempt,Menu Type,Menu Depth,Target Item,Selected Item,Start Time, End Time, Time Difference\n";
		for (var i = 0; i < this.trials.length; i++) {
			csvFile += this.trials[i].join(',');
			csvFile += "\n";
		}

		var hiddenLink = document.createElement('a');
		hiddenLink.href = 'data:text/csv;charset=utf-8,' + encodeURI(csvFile);
		hiddenLink.target = '_blank';
		hiddenLink.download = 'experiment.csv';
		document.body.appendChild(hiddenLink);
		hiddenLink.click();
	}


}