function CircularDependencyError(path) {
  this.name = "CircularDependencyError";
  this.path = path;
  this.stack = (new Error()).stack;
}

CircularDependencyError.prototype = new Error

export class World {
  constructor() {
    this.registry = {};
    this.resolving = undefined;
  }

  register(name, value) {
    var dependency = new Dependency(value);
    this.registry[name] = dependency;
    return dependency;
  }

  get(name, ...extraArgs) {
    try {
      this.resolving = name;
      if (!this.registry[name]) {
        throw new Error("World does not contain " + name);
      }
      var value = this.registry[name].get(this, ...extraArgs);
      this.resolving = undefined;
      return value;
    } catch (error) {
      if (error.name == "CircularDependencyError") {
        var fullPath = [name].concat(error.path);
        throw new Error("Circular Dependency: " + fullPath.join(" -> "));
      } else {
        throw error;
      }
    }
  }

  __getNext(name, ...extraArgs) {
    try {
      if (name == this.resolving) {
        throw new CircularDependencyError([])
      }
      if (!this.registry[name]) {
        throw new Error("World does not contain " + name);
      }
      return this.registry[name].get(this, ...extraArgs);
    } catch(error) {
      if (error.name == "CircularDependencyError") {
        throw new CircularDependencyError([name].concat(error.path))
      } else {
        throw error;
      }
    }
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
        return world.__getNext(dep);
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
