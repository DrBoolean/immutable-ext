const Immutable = require('immutable')
const {List, Map} = Immutable

// List

// traversable
List.prototype.traverse = function(point, f) {
  return this.reduce((ys, x) =>
    f(x).map(x => y => y.concat(x)).ap(ys), point(List()))
}

// foldable
List.prototype.fold = function(empty) {
  return this.reduce((acc, x) => acc.concat(x), empty)
}

List.prototype.foldMap = function(monoid) {
  return this.map(x => monoid(x)).fold(monoid.empty)
}

// monoid
List.empty = List()
List.prototype.empty = List.empty

// applicative
List.prototype.ap = function(other) {
  return this.map(f => other.map(x => f(x))).flatten()
}


// Map
Map.prototype.concat = function(other) {
  return this.mergeWith((prev, next) => prev.concat(next), other)
}

Map.empty = Map({})
Map.prototype.empty = Map.empty

module.exports = Immutable
