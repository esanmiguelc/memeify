describe("Memeify", function() {
  it("adds a bottom caption to the image", function() {
    var canvas = document.createElement('canvas');
    canvas.width = 100;
    canvas.height = 100;
    // create a fake canvas that we can spy on
    Memeify.createMeme("src/image.jpg", canvas, "", "Some1");
    expect().toBe();
  });
});
