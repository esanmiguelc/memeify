'use strict';
describe('Memeify', function () {

    var canvas;
    var context;
    var image;

    beforeEach(function () {
        canvas = document.createElement('canvas');
        context = canvas.getContext('2d');
        image = new Image();
        image.src = 'sample.jpg';
        canvas.width = 100;
        canvas.height = 100;
    });

    describe('#createMeme', function () {
        var memeify;
        var wrapper;

        beforeEach(function () {
            wrapper = new ContextWrapper(context);
            memeify = new Memeify(wrapper);
            wrapper.setFont(48, 'sans-serif');
        });

        it('sets the font size and style', function () {
            memeify.createMeme(image, canvas, '', '');

            expect(wrapper.getFont()).toBe('48px sans-serif');
        });
        
        it('draws text from top and bottom', function () {
            spyOn(context, 'fillText');
            memeify.createMeme(image, canvas, 'a', 'b');

            expect(context.fillText).toHaveBeenCalledTimes(2);
        });

        it('re-sizes the font if text is too big', function () {
            memeify._fitText(canvas, 'hellii', 90, true);

            expect(wrapper.getFont()).toBe('44px sans-serif')
        });

        it('only re-sizes up to 16px', function () {
            memeify._fitText(canvas, 'super long text', '');

            expect(wrapper.getFont()).toBe('16px sans-serif')
        });

        it('calls fill text for the top text with some padding', function () {
            spyOn(wrapper, 'drawText');
            var topText = "text";
            memeify.createMeme(image, canvas, topText, '');

            expect(wrapper.drawText)
                .toHaveBeenCalledWith(topText, jasmine.any(Number), 48);
        });

        it('centers the text', function () {
            spyOn(context, 'fillText');
            var fakeMeasure = jasmine.createSpy('context');
            spyOn(context, 'measureText').and.returnValue(fakeMeasure);
            fakeMeasure.width = 50;
            var topText = "text";

            memeify.createMeme(image, canvas, topText, '');

            expect(context.fillText).toHaveBeenCalledWith(topText, 25, jasmine.any(Number));
        });

        it('splits into multiple lines', function () {
            spyOn(context, 'fillText');
            memeify._fitText(canvas, 'super long text', 90);

            expect(context.fillText).toHaveBeenCalledTimes(2);
        });

        it('sets the image', function () {
            spyOn(context, 'drawImage');

            memeify.createMeme(image, canvas, '', '');

            expect(context.drawImage).toHaveBeenCalledWith(jasmine.any(Image), 0, 0);
        });
    });

    describe('#splitLines', function () {
        
        it('keeps it in one line if it fits in one line', function () {
            var context = new FakeContext();
            var memeify = new Memeify(context);

            context.setTextWidthResults([50, 60]);
            var result = memeify.splitLines('long text', 100);

            expect(result).toEqual(['long text']);
        });

        it('splits the line if its too long', function () {
            var context = new FakeContext();
            var memeify = new Memeify(context);

            context.setTextWidthResults([10, 15, 101, 15]);
            var result = memeify.splitLines('super long text something', 100);

            expect(result).toEqual(['super long', 'text something']);
        });
    });

    describe('#placeText', function () {
        var context;
        var memeify;

        beforeEach(function () {
            context = new FakeContext();
            memeify = new Memeify(context);
        });

        it('places the first row in the correct position', function () {
            var rows = ['hello'];
            var fontSize = 32;

            context.setTextWidthResults([50]);
            memeify.placeText(rows, fontSize, 100);

            var firstArguments = {
                'fontSize': fontSize,
                'center': 25,
                'line': rows[0]
            };

            expect(context.drawTextCalls[0]).toEqual(firstArguments);
        });

        it('places the second row directly below the first one', function () {
            var rows = ['hello', 'world'];
            var fontSize = 32;

            context.setTextWidthResults([50, 50]);
            memeify.placeText(rows, fontSize, 100);

            var secondArguments = {
                'fontSize': fontSize + fontSize,
                'center': 25,
                'line': rows[1]
            };

            expect(context.drawTextCalls[1]).toEqual(secondArguments);
        });

        it('places the third row directly below the second one', function () {
            var rows = ['hello', 'world', 'third'];
            var fontSize = 32;

            context.setTextWidthResults([50, 50, 50]);
            memeify.placeText(rows, fontSize, 100);

            var thirdArguments = {
                'fontSize': fontSize * 3,
                'center': 25,
                'line': rows[2]
            };

            expect(context.drawTextCalls[2]).toEqual(thirdArguments);
        });
    });

    describe('#placeBottomText', function () {
        var context;
        var memeify;

        beforeEach(function () {
            context = new FakeContext();
            memeify = new Memeify(context);
        });

        it('places one line on the bottom', function () {
            var rows = ['hello'];
            var fontSize = 32;

            context.setTextWidthResults([50]);
            memeify.placeBottomText(rows, fontSize, 100, 100);

            var firstArguments = {
                'fontSize': 100 - fontSize,
                'center': 25,
                'line': rows[0]
            };

            var firstCall = context.drawTextCalls[0];
            expect(firstCall).toEqual(firstArguments);
        });

        it('places last line first', function () {
            var rows = ['hello', 'world'];
            var fontSize = 32;

            context.setTextWidthResults([50]);
            memeify.placeBottomText(rows, fontSize, 100, 100);

            var secondArguments = {
                'fontSize': 100 - fontSize,
                'center': 25,
                'line': rows[1]
            };

            var firstCall = context.drawTextCalls[0];
            expect(firstCall).toEqual(secondArguments);
        });

        it('places second line before of the first one', function () {
            var rows = ['hello', 'world', 'test'];
            var fontSize = 32;

            context.setTextWidthResults([50, 50, 50]);
            memeify.placeBottomText(rows, fontSize, 100, 100);

            var firstArguments = {
                'fontSize': 100 - fontSize * 3,
                'center': 25,
                'line': rows[0]
            };

            var thirdCall = context.drawTextCalls[2];
            expect(thirdCall).toEqual(firstArguments);
        });
    });

    describe('#getCenter', function () {
        it('gets the center of a text', function () {
            var context = new FakeContext();
            var memeify = new Memeify(context);
            var width = 100;
            var text = 'some';

            context.setTextWidthResults([50]);
            var result = memeify.getCenter(width, text);

            expect(result).toEqual(25);
        });
    });

    describe('#exportToJpeg', function () {
        it('calls data URL', function () {
            var canvas = jasmine.createSpyObj('canvas', ['getContext', 'toDataURL']);
            var memeify = new Memeify(null, canvas);
            memeify.exportToJpeg(1.0);
            expect(canvas.toDataURL).toHaveBeenCalled();
            expect(canvas.toDataURL).toHaveBeenCalledWith("image/jpeg", 1.0);
        });
    });

    describe('#calculateFontSize', function () {
        var context;
        var memeify;

        beforeEach(function () {
            context = new FakeContext();
            memeify = new Memeify(context);
        });

        it('maintains the font size when it fits', function () {
            var text = 'test';
            var options = {
                'minFontSize': 16,
                'initialFontSize': 48,
                'maxWidth': 100
            };
            var fontSize = memeify.calculateFontSize(text, options);

            expect(fontSize).toBe(48);
        });

        it('reduces the font size when it is too big', function () {
            context.setTextWidthResults([101, 100]);
            var text = 'hello';
            var options = {
                'minFontSize': 16,
                'initialFontSize': 48,
                'maxWidth': 100
            };

            var fontSize = memeify.calculateFontSize(text, options);

            expect(fontSize).toBe(46);
        });

        it('reduces the font size multiple times until it reaches lowest size', function () {
            context.setTextWidthResults([102, 101]);
            var text = 'hello';
            var options = {
                'minFontSize': 16,
                'initialFontSize': 20,
                'maxWidth': 100
            };

            var fontSize = memeify.calculateFontSize(text, options);

            expect(fontSize).toBe(options.minFontSize);
        });
    });
});
