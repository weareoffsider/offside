import {World} from "./World.js";

var Offside = {
  World: World,
}

if (typeof window !== "undefined") window.Offside = Offside;
module.exports = Offside;
