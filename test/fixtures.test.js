"use strict";

var fs = require("fs");
var path = require("path")
var glob = require("glob");
var Haml = require("../haml");

describe("HAML", function (done) {
  var files = glob.sync(__dirname + "/fixtures/**/*.haml");

  files.forEach(function (hamlFile) {
    var task = it;

    // For testing a single task
    if (/whitespace\.haml$/i.test(hamlFile)) {
      task = it.only;
    }

    describe("test " + hamlFile.split(path.sep).pop(), function () {
      var scopeFile = hamlFile.replace(/haml$/, "js");
      var htmlFile = hamlFile.replace(/haml$/, "html");

      var haml = fs.readFileSync(hamlFile).toString();
      var expected = fs.readFileSync(htmlFile).toString();
      var scope = fs.existsSync(scopeFile) ? eval("(" + fs.readFileSync(scopeFile).toString() + ")") : {};

      var js = Haml.compile(haml);
      var js_opt = Haml.optimize(js);
      var jsFn = Haml(haml);

      it("should pass Haml()", function () {
        var actual = jsFn.call(scope.context, scope.locals);
        actual.trim().should.equal(expected.trim());
      });

      it("should pass Haml.render()", function () {
        var actual = Haml.render(haml, {
          context: scope.context,
          locals: scope.locals
        });
        actual.trim().should.equal(expected.trim());
      });
    });
  });
});
