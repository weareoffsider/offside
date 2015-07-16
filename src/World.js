export class World {
  constructor() {
    this.registry = {};
  }

  register(name, value) {
    var dependency = new Dependency(value);
    this.registry[name] = dependency;
    return dependency;
  }

  get(name, ...extraArgs) {
    if (!this.registry[name]) {
      throw new Error("World does not contain " + name);
    }
    return this.registry[name].get(this, ...extraArgs);
  }
}

class Dependency {
  constructor(coreValue) {
    this.coreValue = coreValue;
    this.once = true;
    this.strategy = "value";
  }

  newWith(...args) {
    this.dependencies = args;
    this.strategy = "new";
    return this;
  }

  callWith(...args) {
    this.dependencies = args;
    this.strategy = "call";
    return this;
  }

  instances() {
    this.once = false;
    return this;
  }

  get(world, ...extraArgs) {
    if (this.once && this.singleton) {
      return this.singleton;
    };

    var args = [];
    var dep = this.coreValue;
    var val;

    if (this.strategy == "new" || this.strategy == "call") {
      var args = this.dependencies.map((dep) => {
        return world.get(dep);
      });
    }

    args = args.concat(extraArgs);

    switch (this.strategy) {
      case "value":
        val = dep;
        break;

      case "new":
        val = new dep(...args);
        break;

      case "call":
        val = dep(...args);
        break;
    }

    if (this.once) {
      this.singleton = val;
    }

    return val;
  }
}
