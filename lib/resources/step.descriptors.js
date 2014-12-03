const _scenario = "<blockquote style='text-align:justify;'>You are an engineering student and are looking for a 4-month internship position – doing an internship in a good place outside Italy would be a huge plus on your CV. Getting in such a place is hard. <br/> Your thesis supervisor worked in London for a while and has agreed to give you a recommendation letter to a few companies there. Googling “London Engineering Companies, prof. Smith” retrieved a list of websites. But, you can only contact one company at a time (otherwise prof. Smith's business relationships might get ruined). <br/> Thus, you want to consider all websites from the list and re-arrange the list <u>according to how much you would like to get in a company</u> (the most desirable companies go on the top).</blockquote>";
var _steps = {
	"error": {
		title: "Keep calm and call up the admin",
		text : "That's right. Keep calm."
	},
	"webpage.aesthetics.150": {
		title: "First-impression webpage aesthetics",
		text: "In every trial: <br/> 1. look at the middle of red fixation cross (!important) <br/> 2. watch a webpage screenshot being flashed on the screen <br/> 3. rate webpage aesthetics <br/><br/> NOTE: first 3 trials are test trials"
	},
	"webpage.aesthetics.4": {
		title: "Webpage aesthetics",
		text: "In every trial: <br/> 1. explore a webpage screenshot for at least 4 sec <br/> 2. rate webpage aesthetics <br/><br/> NOTE: you can scroll down the screenshots"
	},
	"google.experience": {
		title: "Free website exploration",
		text: "a) read the scenario below and imagine yourself in the described situation:" + _scenario + " 2. browse websites <br/> 3. order the website list"
	},
	"tasks.and.ratings" :{
		title: "Directed website exploration",
		text : "For each website: <br/> 1. Search info on a website to answer 2 questions <br/> 2. Rate a company and their website <br/><br/> NOTE: some websites don't show all required info"
	},
	"free.text.descriptions": {
		title: "Free-text company-preference description",
		text : "Describe briefly the reasons you preferred one company and disregarded the other."
	}
};

module.exports = {
	_debug: null,
	_console: null,
	init: function(props, console){
		this._debug = props.debug;
		this._console = console;
		return this;
	},
	getStep: function(stepName){
		if(this._debug === undefined){
			console.log("You forgot to initialize the 'step.descripsions.js'.");
		}
		if(!stepName || !_steps[stepName]){
			var err = new Error("stepName '" + stepName + "' doesn't exist");
			if(this._debug){
				throw err;
			}
			if(this._console){
				this._console.error(err);
			}
			return _steps["error"];
		}
		return _steps[stepName];
	}
};