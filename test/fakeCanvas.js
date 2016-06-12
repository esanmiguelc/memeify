var FakeCanvas = (function() {
'use strict';

  function FakeCanvas() {
    this.width = 0;
    this.height = 0;
    this.font = "";
  }

  FakeCanvas.prototype.getContext = function(_) {
    return this;
  };

  return FakeCanvas;
})();
