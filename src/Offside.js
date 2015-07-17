import {World} from "./World.js";
import {Actor, Action} from "./Actor.js";
import {Lookout} from "./Lookout.js";
import {Store} from "./Store.js";

var Offside = {
  World: World,
  Actor: Actor,
  Action: Action,
  Store: Store,
  Lookout: Lookout,
}

if (typeof window !== "undefined") window.Offside = Offside;
module.exports = Offside;
