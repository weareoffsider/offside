export class Actor {
  constructor(dispatcher) {
    this.dispatcher = dispatcher
  }

  doAction(type, args) {
    this.dispatcher.dispatch(new Action(type, args))
  }
}

export class Action {
  constructor(type, args) {
    this.type = type
    this.args = args
  }
}
