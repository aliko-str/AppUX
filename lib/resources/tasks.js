var _debug;

var tasks = {
	"find.contacts" : {
		id : "find.contacts",
		text : "The task needs to be rewritten, e.g., please find the year of company set up OR find the address of company headquarters?",
		saveName : "data.task.find.contact"
	},
	"best.website.free.description" : {
		id : "best.website.free.description",
		text : "You've ranked this company as <big><strong>the most</strong></big> desirable place for your internship. Please write 3 or more short phrases explaining why you decided so (<span style='color:#7F0906;'>use semicolons to split the phrases</span>).",
		saveName : "data.task.best.website.description"
	},
	"worst.website.free.description" : {
		id : "worst.website.free.description",
		text : "You've ranked this company as <big><strong>the least</strong></big> desirable place for your internship. Please write 3 or more short phrases explaining why you decided so (<span style='color:#7F0906;'>use semicolons to split the phrases</span>).",
		saveName : "data.task.worst.website.description"
	}
};

module.exports = {
	init: function(props){
		_debug = props.debug;
		return this;
	},
	getTasks : function(taskNames) {
		if(_debug === undefined){
			console.log("You forgot to initialize the 'questions' module.");
		}
		if( typeof taskNames === "string") {
			return tasks[taskNames];
		}
		var res = [];
		for(var i = questionsNames.length; i--; ) {
			var _tmpQuest = tasks[taskNames[i]];
			if(!_tmpQuest){
				var err = new Error("There is no such question: " + taskNames[i]);
				console.error("9fe2p ", err);
				if(_debug){
					throw err;
				}
			}else{
				res.push(_tmpQuest);
			}
		}
		return res;
	}
};
