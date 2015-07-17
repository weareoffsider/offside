import {Actor, Action} from "../src/Actor.js";
var expect = require("chai").expect;

var getMockDispatcher = function(cb) {
  return {
    dispatch: function(action) {
      if (cb) {
        cb(action)
      }
    }
  }
}

describe("Actor", function() {
  it("should instantiate", function() {
    var actor = new Actor()
  })

  it("should be able to dispatch an action payload", function(done) {
    var args = {
      "selectedCity": "paris"
    }

    var dispatcher = getMockDispatcher(function(action) {
      expect(action.type).to.equal("city-update")
      expect(action.args).to.equal(args)
      expect(action).to.be.an.instanceof(Action)
      done()
    })

    var actor = new Actor(dispatcher)
    actor.doAction("city-update", args)
  })
})
