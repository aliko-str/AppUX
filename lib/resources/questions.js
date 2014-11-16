var _debug;

var _questions = {
	"website.aesthetics" : {
		id : "website.aesthetics",
		question : "How ugly/beautiful did the website seem to you?",
		saveName : "data.website.aesthetics",
		apUXWebsMinLabel : "Ugly",
		apUXWebsMaxLabel : "Beautiful"
	},
	"webpage.aesthetics" : {
		id : "webpage.aesthetics",
		question : "How ugly/beautiful does the webpage seem to you?",
		saveName : "data.webpage.aesthetics",
		apUXWebsMinLabel : "Ugly",
		apUXWebsMaxLabel : "Beautiful"
	},
	"company.image.as.employer" : {
		id : "company.image.as.employer",
		question : "Overall how would you evaluate this company's image as an internship place?",
		saveName : "data.company.as.employer",
		apUXWebsMinLabel : "Negative",
		apUXWebsMaxLabel : "Positive"
	},
	"website.usability" : {
		id : "website.usability",
		question : "How easy-to-use/difficult-to-use did the website seem to you?",
		saveName : "data.website.usability",
		apUXWebsMinLabel : "Easy",
		apUXWebsMaxLabel : "Difficult"
	},
	"website.content" : {
		id : "website.content",
		question : "How useless/useful did the information on the website seem to you?",
		saveName : "data.website.content",
		apUXWebsMinLabel : "Useless",
		apUXWebsMaxLabel : "Useful"
	},
	"company.favorability" : {
		id : "company.favorability",
		question : "How favorable/unfavorable is your impression of this company in general?",
		saveName : "data.company.favorability",
		apUXWebsMinLabel : "Favorable",
		apUXWebsMaxLabel : "Unfavorable"
	}
};

module.exports = {
	init: function(props){
		_debug = props.debug;
		return this;
	},
	getQuestions : function(questionNames) {
		if(_debug === undefined){
			console.log("You forgot to initialize the 'questions' module.");
		}
		if( typeof questionNames === "string") {
			return _questions[questionNames];
		}
		var res = [];
		for(var i = questionNames.length; i--; ) {
			var _tmpQuest = _questions[questionNames[i]];
			if(!_tmpQuest){
				var err = new Error("There is no such question: " + questionNames[i]);
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
