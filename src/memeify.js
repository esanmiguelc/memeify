'use strict';
var Memeify;

Memeify = (function () {

    function Memeify(context) {
        this.context = context;
    }

    Memeify.newInstance = function (canvas) {
        this.canvas = canvas;
        this.context = new ContextWrapper(canvas.getContext('2d'));
        return new Memeify(this.context);
    };

    Memeify.prototype.createMeme = function (image, canvas, topText, bottomText) {
        var maxWidth = (canvas.width * 0.90);
        this.context.setFont(48, 'sans-serif');
        this.context.setFontColor("white");
        this.context.drawImage(image, 0, 0);

        this._fitText(canvas, topText, maxWidth, true);
        this._fitText(canvas, bottomText, maxWidth, false);
    };

    Memeify.prototype._fitText = function (canvas, text, maxWidth, isTop) {
        var options = {
            'minFontSize': 16,
            'initialFontSize': 48,
            'maxWidth': maxWidth
        };
        var fontSize = this.calculateFontSize(text, options);
        this.context.setFont(fontSize, 'sans-serif');

        var split = this.splitLines(text, maxWidth);

        if (isTop) {
            this.placeText(split, fontSize, canvas.width);
        } else {
            this.placeBottomText(split, fontSize, canvas.width, canvas.height);
        }
    };

    Memeify.prototype.calculateFontSize = function (text, options) {
        var initialSize = options.initialFontSize;
        while (this.context.getTextWidth(text) > options.maxWidth) {
            if (initialSize == options.minFontSize) {
                break;
            }
            initialSize -= 2;
            this.context.setFont(initialSize, "sans-serif");
        }
        return initialSize;
    };

    Memeify.prototype.splitLines = function (text, maxWidth) {
        var result = [];
        var words = text.split(' ');
        var line = '';
        for (var i = 0; i < words.length; i++) {
            var currentWord = words[i];
            var width = this.context.getTextWidth(line + " " + currentWord);
            if (width < maxWidth) {
                line += currentWord + " ";
            } else {
                this._pushSplitLine(result, line);
                line = currentWord;
            }
        }
        this._pushSplitLine(result, line);
        return result;
    };

    Memeify.prototype._pushSplitLine = function (result, line) {
        if (line != "") {
            result.push(line.trim());
        }
    };

    Memeify.prototype.placeText = function (rows, fontSize, width) {
        for (var i = 0; i < rows.length; i++) {
            var currentRow = rows[i];
            var center = this.getCenter(width, currentRow);
            if (i == 0) {
                this.context.drawText(currentRow, center, fontSize);
            } else {
                this.context.drawText(currentRow, center, (fontSize * (i + 1)));
            }
        }
    };

    Memeify.prototype.placeBottomText = function (rows, fontSize, width, height) {
        var count = 1;
        for (var i = rows.length; i > 0; i--) {
            var currentRow = rows[i - 1];
            var center = this.getCenter(width, currentRow);
            this.context.drawText(currentRow, center, height - (fontSize * count));
            count += 1;
        }
    };

    Memeify.prototype.getCenter = function (width, text) {
        return ((width - this.context.getTextWidth(text)) / 2);
    };

    return Memeify;
})();
