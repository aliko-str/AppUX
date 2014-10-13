// 1 - listen for an 'init' event and get baseUrl, folder, main.js
// 1.5 -- save the these vars
// 2 - load main.js
// give main.js the reference to listen to communications
if(window.document.AppUX){
	if(self.options.debug){
		self.port.emit("error", {errCode: "#cwu8d", message: "window.document.AppUX already exists"});
	}
	console.error("#cwu8d window.document.AppUX already exists");
}else{
	window.document.AppUX = {};
}
window.document.AppUX.ejs = {};
window.document.AppUX.loadCss = function(href){
  var fileref=document.createElement("link");
  fileref.setAttribute("rel", "stylesheet");
  fileref.setAttribute("type", "text/css");
  fileref.setAttribute("href", href);
  if (typeof fileref!="undefined"){
    document.getElementsByTagName("head")[0].appendChild(fileref);
  }
};
window.document.AppUX.loadImage = function(imgId, imgSrc, onloadCallback){
  var loaded = false;
  function loadHandler() {
      if (loaded) {
          return;
      }
      loaded = true;
      onloadCallback();
  }
  var img = document.getElementById(imgId);
  if(!img) {
  	self.port.emit("error", {errCode: "andsc", str: "An image element '" + imgId.toString() + "' hasn't been found"});
  	return null;
  };
  img.addEventListener('load', loadHandler);
  img.src = imgSrc;
  //img.style.display = 'block';
  if (img.complete) {
      loadHandler();
  }
  return img;
};
window.document.AppUX.loadEjs = function(ejsUrl, ejsName){
  App.ejs[ejsName] = new EJS({url: App.baseUrl + ejsUrl});
};
window.document.AppUX.loadJsFile = function(jsurl, onloadCallback){
  var fileref=document.createElement('script');
  fileref.setAttribute("type","text/javascript");
  fileref.setAttribute("src", jsurl);
  onloadCallback = onloadCallback || function(){};
  fileref.onreadystatechange= function () {
    if (this.readyState == 'complete') onloadCallback();
  };
  fileref.onload = onloadCallback;
  document.getElementsByTagName("head")[0].appendChild(fileref);
};

window.document.AppUX.log = function(message){
	self.port.emit("log", message);
	return console.log(message);
};
window.document.AppUX.info = window.document.AppUX.log;
window.document.AppUX.error = function(errCode, message){
	if(!message){
		message = errCode;
		errCode = "unspecif";
	}
	self.port.emit("error", {errCode: errCode, message: message});
	return console.error(errCode, message);
};

window.document.AppUX.initClientScript = function(){
	self.port.on("init", function(message) {
	  alert(message);
	});
	this.port = self.options.port;
	this.baseUrl = self.options.baseUrl;
	this.loadJsFile(this.baseUrl + self.options.folder + self.options.mainJsName, function(){
		console.log("Js loaded");
	});
	self.port.removeListener("init");
	self.port.emit("injected", "client.starter.js");
	window.addEventListener('error', function (evt) {
	    self.port.emit("error", {errCode: "gxu3x", str: "Caught[via 'error' event]:  '" + evt.message + "' from " + evt.filename + ":" + evt.lineno});
	    return;
	});
};

window.document.AppUX.initClientScript();
