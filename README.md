# Offside

Simple Dependency Injection and Flux Style Tools for your webapp.

Needs suiting for my style of applications, your mileage may vary. While there
are some conventional rules for interactions between the Store, Lookout, and
Actor, there are no particularly hard dependencies between the components.

## World

A dependency injection context, that lets you register values, classes and
constructor functions with a string identifier, and then give them a strategy
for instantiation when something requests something from the register.

### World API
#### Instantiation
```
var world = new World();
```

#### World.register(key: string, value: any): Dependency
Register a value as a dependency. The key will be used by other registered
dependencies to identify this value. A dependency is returned so you can do
further configuration on it.

#### World.get(key: string, ...extraArgs: Array<any>): any
Get a dependency from the world. The dependency will be returned in a form based
on the strategy it is given. You can provide extra arguments which will be added
onto the end of the dependency's default arguments, which can be useful when
using an `instances` strategy, demonstrated below.


### Dependency API
A dependency allows you to manage the strategy that the dependency is
instantiated with. The default strategy is to simply return the value as is.
You can register a simple value just through the world:

```
var myValue = 123;
var dependency = world.register("myValue", myValue);
myValue == world.get("myValue") // true
```

#### Dependency.newWith(...keys: Array<string>): Dependency
Calling `newWith` on a dependency instructs the world to create it using `new`. 
By default dependencies are singletons, so the dependency will only be created
once. The arguments instruct the world to call new using those dependencies as
arguments.

```
class MyTestClass {
  constructor(myValue) {
    console.log("Hello ", myValue)
  }
}

var myValue = 123;
world.register("myValue", myValue)
world.register("MyTestClass", MyTestClass).newWith("myValue")
var myTestClassInstance = world.get("MyTestClass") // logs: "Hello 123"
myTestClassInstance = world.get("MyTestClass") // singleton so returned as is
```

In this case, the "MyTestClass" dependency will be instantiated as if we did:
```
var myTestClassInstance = new MyTestClass(myValue)
```


#### Dependency.callWith(...keys: Array<string>): Dependency
Calling `callWith` on a dependency instructs the world to create in by simply
calling the passed value as a function. As with `new`, by default it will only
be returned once as a singleton.

```
var myTestConstructor = function(myValue) {
  return {
    "theValue": myValue
  }
}

var myValue = 123;
world.register("myValue", myValue)
world.register("myTestConstructor", myTestConstructor).callWith("myValue")
var myOutput = world.get("myTestConstructor")
```

Getting the dependency is equivalent to:
```
var myOutput = myTestConstructor(myValue)
```


#### Dependency.instances(): Dependency
`instances` sets the dependency to return a new instance or result everytime the
dependency is requested. This can work well for temporarily required instances
that may be supplied dependencies from the world, and additional arguments. For
example:

```
class MyTestClass {
  constructor(myValue, extraArg) {
    console.log("Hello ", myValue, extraArg)
  }
}

var myValue = 123;
world.register("myValue", myValue)
world.register("MyTestClass", MyTestClass).newWith("myValue").instances()
var myTestClassInstance1 = world.get("MyTestClass", "Some String")
// logs: "Hello 123 Some String"

var myTestClassInstance2 = world.get("myTestClass", "Some other string")
myTestClassInstance1 !== myTestClassInstance2
```


#### Circular Dependencies
World.get will throw an exception if a circular dependency is encountered.






## License
Copyright (c) 2015 Offsider, used under The MIT License (MIT)

License provided in LICENSE.md
