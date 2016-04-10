'use strict';
var FakeContext;

FakeContext = (function () {

    FakeContext = function () {
        this.widthResults = [];
        this.drawTextCalls = [];
    };

    FakeContext.prototype.getTextWidth = function (text) {
        return this.widthResults.shift();
    };

    FakeContext.prototype.setTextWidthResults = function (results) {
        this.widthResults = results;
    };

    FakeContext.prototype.setFont = function () {
    };

    FakeContext.prototype.drawText = function (line, center, y) {
        var arg = {
            'fontSize': y,
            'center': center,
            'line': line
        };
        this.drawTextCalls.push(arg);
    };

    return FakeContext;
})();
