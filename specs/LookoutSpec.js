import {Lookout} from "../src/Lookout.js";
var expect = require("chai").expect;
var _ = require("lodash")

var getMockStore = function(cb) {
  return {
    register: function(eventName, listener) {
      if (cb) {
        cb("register", eventName, listener)
      }
    },
    unregister: function(eventName, listener) {
      if (cb) {
        cb("unregister", eventName, listener)
      }
    },
    emit: function(eventName) {
    },
  }
}

describe("Lookout", function() {
  it("should allow use of register store method", function() {
    var lookout = _.create(Lookout)
    var store = getMockStore()
    lookout.getInitialState()
    lookout.registerStore(store, {
      "change": function() {}
    })
  })

  it("should call register on store when mounting", function(done) {
    var lookout = _.create(Lookout)
    var store = getMockStore(function(method, ...args) {
      expect(method).to.equal("register")
      expect(args[0]).to.equal("change")
      done()
    })
    lookout.getInitialState()
    lookout.registerStore(store, {
      "change": function() {}
    })
    lookout.componentWillMount()
  })

  it("should call unnregister on store when unmounting", function(done) {
    var lookout = _.create(Lookout)
    var store = getMockStore(function(method, ...args) {
      expect(method).to.equal("unregister")
      expect(args[0]).to.equal("change")
      done()
    })
    lookout.getInitialState()
    lookout.registerStore(store, {
      "change": function() {}
    })
    lookout.componentWillUnmount()
  })

  it("listener functions are equal on register and unregister", function(done) {
    var lookout = _.create(Lookout)
    var lastCb = null;
    var store = getMockStore(function(method, ...args) {
      if (method == "register") lastCb = args[1]
      if (method == "unregister") {
        expect(args[1]).to.equal(lastCb)
        done()
      }
    })
    lookout.getInitialState()
    lookout.registerStore(store, {
      "change": function() {}
    })
    lookout.componentWillMount()
    lookout.componentWillUnmount()
  })
})
