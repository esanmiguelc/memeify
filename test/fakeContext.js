var FakeContext;

FakeContext = (function() {

  var widthResults;

  FakeContext = function () {
    this.widthResults = [];
  }

  FakeContext.prototype.getTextWidth = function(text) {
    return this.widthResults.shift();
  };

  FakeContext.prototype.setTextWidthResults = function(results) {
    this.widthResults = results;
  };

  return FakeContext;
})();
