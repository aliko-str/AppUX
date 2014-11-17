(function() {
	"use strict";
	var ap = window.AppUX;
	var msgTmpl = '\
		<div align="center" style="display:none;position:absolute;top:0;left:0;width:100%;height:61px;background-color:#F8F8FF;" class="container">\
			<div class="row">\
				<div class="col-md-8 col-md-offset-2">\
					<div id="subtleMessageBox" class="">\
						<br/>\
						<p class="text-muted" id="messageP"></p>\
					</div>\
				</div>\
			</div>\
		</div>';
	
	
	var jqMsgBox = $(msgTmpl);
	var bodyMarginTop = $("body").css("margin-top");
	if(bodyMarginTop){
		bodyMarginTop = bodyMarginTop.replace("px", "");
		bodyMarginTop = parseInt(bodyMarginTop,10);
		bodyMarginTop += 61;
	}else{
		bodyMarginTop = 61;
	}
	$("body").css("margin-top", bodyMarginTop + "px").append(jqMsgBox);
	ap.port.on("msg.show", function(text) {
		jqMsgBox.hide(500).find("#messageP").text(text);
		jqMsgBox.slideDown(600);
		// TODO work out margin-top for 'body' <-- use animation so it moves simultaneously with the msgBox.
	});
	ap.port.on("msg.hide", function() {
		jqMsgBox.hide();
	});
})();
