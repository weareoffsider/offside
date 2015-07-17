import {Store} from "../src/Store.js";
var expect = require("chai").expect;

var getMockDispatcher = function(cb) {
  return {
    register: function(listener) {
      if (cb) {
        cb("register", listener)
      }
      return "mock"
    },
    unregister: function(token) {
      if (cb) {
        cb("unregister", token)
      }
    }
  }
}


describe("Store", function() {
  it("should instantiate", function() {
    var store = new Store()
  })

  it("should be able to register and recall a callback", function(cb) {
    var store = new Store()
    store.register("change", function() {
      cb()
    })
    store.emit("change")
  })

  it("callbacks should be called with store as argument", function(cb) {
    var store = new Store()
    store.register("change", function(ret) {
      expect(ret).to.equal(store)
      cb()
    })
    store.emit("change")
  })

  it("callbacks can be unregistered", function() {
    var store = new Store()
    var calls = 0

    var cb = function() {
      calls += 1
      if (calls > 1) {
        throw new Error("this should not get called again")
      }
    }

    store.register("change", cb)
    store.emit("change")
    store.unregister("change", cb)
    store.emit("change")
    expect(calls).to.equal(1)
  })

  it("should instantiate with dispatcher if provided", function(done) {
    var dispatcher = getMockDispatcher(function(method, cb) {
      expect(method).to.equal("register")
      done()
    })
    var store = new Store(dispatcher)
  })

  it("should get token from dispatcher", function() {
    var dispatcher = getMockDispatcher(function(method, cb) {
    })
    var store = new Store(dispatcher)
    expect(store.dispatchToken).to.equal("mock")
  })

  it("should be able to unregister From Dispatcher", function(done) {
    var dispatcher = getMockDispatcher(function(method, token) {
      if (method == "unregister") {
        expect(token).to.equal("mock")
        done()
      }
    })
    var store = new Store(dispatcher)
    store.unregisterFromDispatcher()
  })
})
