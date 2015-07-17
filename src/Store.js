export class Store {
  constructor(dispatcher) {
    if (dispatcher) {
      this.dispatcher = dispatcher
      this.dispatchToken = dispatcher.register((payload) => {
        this.onDispatch(payload)
      })
    }
    this.listeners = {}
  }

  unregisterFromDispatcher() {
    this.dispatcher.unregister(this.dispatchToken)
  }

  register(eventType, cb) {
    this.listeners[eventType] = this.listeners[eventType] || []
    this.listeners[eventType].push(cb)
  }

  onDispatch(payload) {
    throw new Error("Must implement onDispatch when using dispatcher")
  }

  unregister(eventType, cb) {
    var listeners = this.listeners[eventType] || []
    var ix = listeners.indexOf(cb)
    if (ix != -1) {
      listeners.splice(ix, 1)
    }
  }

  emit(eventType) {
    var listeners = this.listeners[eventType] || []
    listeners.forEach((cb) => {
      cb(this)
    })
  }
}
