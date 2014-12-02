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
		question : "How <b>ugly/beautiful</b> does the webpage seem to you?",
		saveName : "data.webpage.aesthetics",
		apUXWebsMinLabel : "Ugly",
		apUXWebsMaxLabel : "Beautiful"
	},
	"company.image.as.employer" : {
		id : "company.image.as.employer",
		question : "Overall how do you see this company as <b>an internship place</b>?",
		saveName : "data.company.as.employer",
		apUXWebsMinLabel : "Undesirable",
		apUXWebsMaxLabel : "Desirable"
	},
	"website.usability" : {
		id : "website.usability",
		question : "How <b>difficult-to-use/easy-to-use</b> did the website seem to you?",
		saveName : "data.website.usability",
		apUXWebsMinLabel : "Difficult",
		apUXWebsMaxLabel : "Easy"
	},
	"website.content" : {
		id : "website.content",
		question : "How <b>useless/useful</b> did the information on the website seem to you?",
		saveName : "data.website.content",
		apUXWebsMinLabel : "Useless",
		apUXWebsMaxLabel : "Useful"
	},
	"company.favorability" : {
		id : "company.favorability",
		question : "How <b>favorable/unfavorable</b> is your impression of this company in general?",
		saveName : "data.company.favorability",
		apUXWebsMinLabel : "Unfavorable",
		apUXWebsMaxLabel : "Favorable"
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
