(function() {
	window.AppUX;
	var ap = window.AppUX;
	window.AppUX.utilDom = {
		injectRadioButtonScaleCss : function(){
			const styleElId = 'AppUXRadioButtonScaleCss';
			if(!$("#" +styleElId).length){
				$("<link rel='stylesheet' id='" + styleElId + "' type='text/css'></link>").attr("href", ap.baseUrl + "shared/util.dom.css").appendTo("head");
			}
			return;
		},
		createRadioButtonScaleElement : function(ifInline, elFormName, upTo, labels, minMaxLabels) {
			function populateLabels(upTo) {
				var res = new Array(upTo);
				for(var i = 0; i < upTo; i++) {
					res[i] = (i + 1).toString();
				}
				return res;
			}
			this.injectRadioButtonScaleCss();
			labels = labels || populateLabels(upTo);
			if(upTo !== labels.length) {
				ap.port.emit("error", {
					errCode : "8vlkj",
					str : "The number of labels is unequal to the size of scale -- numeric labels will be used"
				});
				labels = populateLabels(upTo);
			}
			var resEl = '';
			var radioClass = ifInline?"radio-inline apUXRadio":"radio";
			var wrapperDiv1 = '<div class="' + radioClass + '">';
			var wrapperDiv2 = '</div>';
			for(var i = 0; i < upTo; i ++){
				var labelElStr = (ifInline?"<p>":"").toString() + "<b>" + labels[i] + "</b>" + (ifInline?"</p>":"").toString();
				var radioElStr = "<label><input type='radio' name='" + elFormName + "' value='" + labels[i] + "' required/>" + labelElStr + "</label><br/>";
				resEl += wrapperDiv1 + radioElStr + wrapperDiv2;
			}
			if(minMaxLabels && minMaxLabels.length > 1){
				resEl = "<span class='vertTop'><big><b>" + minMaxLabels[0] + "</b></big></span>" + resEl +"<span class='vertTop'><big><b>&nbsp;&nbsp;" + minMaxLabels[1] + "</b></big></span>";
			}
			return resEl;
		}
	};
})();
