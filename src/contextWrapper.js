
var ContextWrapper = (function () {
"use strict";

  function ContextWrapper(context) {
    this.context = context;
  }

  ContextWrapper.prototype.getTextWidth = function (text) {
    return this.context.measureText(text).width;
  };

  ContextWrapper.prototype.getFont = function () {
    return this.context.font;
  };

  ContextWrapper.prototype.setFont = function (fontSize, fontFamily) {
    this.context.font = fontSize + "px " + fontFamily;
  };

  ContextWrapper.prototype.drawText = function (text, x, y) {
    this.context.shadowColor='black';
    this.context.shadowBlur=7;
    this.context.fillText(text, x, y);
  };

  ContextWrapper.prototype.setFontColor = function (color) {
    this.context.fillStyle = color;
  };

  ContextWrapper.prototype.drawImage = function (image, x, y) {
    this.context.drawImage(image, x, y);
  };

  return ContextWrapper;
})();
