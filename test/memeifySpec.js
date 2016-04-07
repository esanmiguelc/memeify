describe("Memeify", function() {

  var canvas;
  var context;

  beforeEach(function() {
    canvas = document.createElement('canvas');
    context = canvas.getContext('2d');
    canvas.width = 100;
    canvas.height = 100;
  });

  it("sets the font size and style", function() {
    Memeify.createMeme("src/image.jpg", canvas, "", "");

    expect(context.font).toBe("48px sans-serif");
  });

  it("resizes the font if text is too big", function() {
    Memeify.createMeme("", canvas, "hellii", "");

    expect(context.font).toBe("44px sans-serif")
  });

  it("only resizes up to 16px", function() {
    Memeify.createMeme("", canvas, "super long text", "");

    expect(context.font).toBe("16px sans-serif")
  });

  it("calls fill text for the top text with some padding", function() {
    spyOn(context, 'fillText');
    var topText = "text"
    Memeify.createMeme("", canvas, topText, "");

    expect(context.fillText)
      .toHaveBeenCalledWith(topText, jasmine.any(Number), 58);
  });

  it("centers the text", function() {
    spyOn(context, 'fillText');
    var fakeMeasure = jasmine.createSpy("context");
    spyOn(context, 'measureText').and.returnValue(fakeMeasure);
    fakeMeasure.width = 50;
    var topText = "text"

    Memeify.createMeme("", canvas, topText, "");

    expect(context.fillText)
      .toHaveBeenCalledWith(topText, 25, jasmine.any(Number));
  });

  it("splits into multiple lines", function() {
    spyOn(context, 'fillText');
    Memeify.createMeme("", canvas, "super long text", "");

    expect(context.fillText).toHaveBeenCalledTimes(2);
  });

  xit("sets the image", function() {});

});
