var {Cc, Ci} = require("chrome");

var httpResponseObserver =
{
  observe: function(subject, topic, data)
  {
    if (topic == "http-on-examine-response") {
      var httpChannel = subject.QueryInterface(Ci.nsIHttpChannel);
      httpChannel.setResponseHeader("X-Frame-Options", "", false);
      httpChannel.setResponseHeader("Access-Control-Allow-Origin", "*", false);
      httpChannel.setResponseHeader("X-XSS-Protection", "", false);
    }
  },

  get observerService() {
    return Cc["@mozilla.org/observer-service;1"]
                     .getService(Ci.nsIObserverService);
  },

  register: function()
  {
    this.observerService.addObserver(this, "http-on-examine-response", false);
  },

  unregister: function()
  {
    this.observerService.removeObserver(this, "http-on-examine-response");
  }
};

module.exports = httpResponseObserver;