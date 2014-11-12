var _debug;

var tasks = {
	"find.contacts" : {
		id : "find.contacts",
		text : "The task needs to be rewritten, e.g., please find the year of company set up OR find the address of company headquarters?",
		saveName : ".data.task.find.contact" // not used currently
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
