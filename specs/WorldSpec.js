import {World} from "../src/World.js";
var expect = require("chai").expect;


class TestClass {
  constructor(a, b) {
    this.a = a;
    this.b = b;
  }
}


describe("World", function() {
  it("should instantiate", function() {
    var world = new World();
  });

  it("should register and retrieve basic values", function() {
    var world = new World();
    var a = {"object": "a"};
    world.register("a", a);
    expect(world.get("a")).to.equal(a);
  });

  it("should have a singleton strategy", function() {
    var world = new World();
    var a = {"object": "a"};
    world.register("a", a);
    world.register("b", "b Value");
    world.register("TestClass", TestClass).newWith("a", "b");
    var singleton = world.get("TestClass");
    expect(singleton.a).to.equal(a);
    expect(singleton).to.equal(world.get("TestClass"));
  });

  it("should have a instances strategy", function() {
    var world = new World();
    var a = {"object": "a"};
    world.register("a", a);
    world.register("b", "b Value");
    world.register("TestClass", TestClass).newWith("a", "b").instances();
    var singleton = world.get("TestClass");
    expect(singleton.a).to.equal(a);
    expect(singleton).not.to.equal(world.get("TestClass"));
  });
});
