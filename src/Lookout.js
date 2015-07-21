module.exports.Lookout = {
  getInitialState: function() {
    this._storeRegistrations = []
    return null
  },

  registerStore: function(store, listeners) {
    this._storeRegistrations.push([store, listeners])
  },

  componentWillMount: function() {
    this._storeRegistrations.forEach(function([store, listeners]) {
      for (var eventName in listeners) {
        if (listeners.hasOwnProperty(eventName)) {
          store.register(eventName, listeners[eventName])
        }
      }
    })
  },

  componentWillUnmount: function() {
    this._storeRegistrations.forEach(function([store, listeners]) {
      for (var eventName in listeners) {
        if (listeners.hasOwnProperty(eventName)) {
          store.unregister(eventName, listeners[eventName])
        }
      }

      if (store.temporaryStore) {
        store.unregisterFromDispatcher()
      }
    })
  },
}
