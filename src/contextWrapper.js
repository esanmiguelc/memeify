var ContextWrapper;

ContextWrapper = (function() {

  var context;

  function ContextWrapper(context) {
    this.context = context;
  };

  ContextWrapper.prototype.getTextWidth = function (text) {
    return this.context.measureText(text).width
  };

  return ContextWrapper;
})();
