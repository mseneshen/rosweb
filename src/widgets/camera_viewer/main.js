var WidgetCameraViewer = function (widgetInstanceId, serializedData) {
  // Mandatory properties
  var self = this;
  this.widgetInstanceId = widgetInstanceId;
  this.selector = ".jsWidgetContainer[data-widget-instance-id=" + self.widgetInstanceId + "]";

  // Mandatory callback methods
  this.clbkCreated = function () {
    self.host = $("#jsRosUrl").val().split("//")[1].split(":")[0];

    self.serializedData = serializedData;
    if(self.serializedData && self.serializedData.topic){
      self.host = self.serializedData.host;
      self.port = self.serializedData.port;
      self.width = self.serializedData.width;
      self.height = self.serializedData.height;
      self.onchange(self.serializedData.topic);
    }
  };
  this.clbkConfirm = function() {

  };
  this.clbkResized = function (width, height) {
    self.width = width;
    self.height = height;
    if (self.viewer != null) {
      self.viewer.width = width;
      self.viewer.height = height;
    }
    $(self.viewerElement).attr({
      width: width,
      height: height
    });
  };
  this.clbkMoved = function (x, y) { };
  this.clbkTab = function (isMyTab) { };

  this.onchange = function (selectedTopic) {
    $(self.viewerElement).remove();
    self.viewer = new MJPEGCANVAS.Viewer({
      querySelector: '.jsWidgetContainer[data-widget-instance-id=\'' + self.widgetInstanceId + '\'] .jsMjpeg',
      host: self.host,
      port: self.webVideoServerPort,
      width: self.width,
      height: self.height,
      topic: selectedTopic
    });
    self.serializedData.host = self.host;
    self.serializedData.port = self.port;
    self.serializedData.width = self.width;
    self.serializedData.height = self.height;
    self.serializedData.topic = selectedTopic;
  };

  // parameters
  this.webVideoServerPort = 8080;

  // helper properties and methods
  this.host = $("#jsRosUrl").val().split("//")[1].split(":")[0];
  this.viewer = null;
  this.viewerElement = self.selector + ' .jsMjpeg canvas';
  this.width = 480;
  this.height = 360;

};

$(document).ready(function () {
  // If you need an onload callback
});