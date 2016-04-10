"use strict";
var ContextWrapper;

ContextWrapper = (function() {

  function ContextWrapper(context) {
    this.context = context;
  }
  ContextWrapper.prototype.getTextWidth = function (text) {
    return this.context.measureText(text).width
  };

  ContextWrapper.prototype.getFont = function() {
    return this.context.font;
  };

  ContextWrapper.prototype.setFont = function(fontSize, fontFamily) {
    var font = fontSize + "px " + fontFamily;
    this.context.font = font;
  };

  ContextWrapper.prototype.drawText = function(text, x, y) {
    this.context.fillText(text, x, y);
  };

  ContextWrapper.prototype.drawImage = function(imagePath, x, y) {
    var image = new Image();
    image.src = image;
    this.context.drawImage(image, x, y);
  };

  return ContextWrapper;
})();
