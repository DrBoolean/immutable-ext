const Immutable = require('immutable')
const {List, Map} = Immutable

const derived = {
  fold : function(empty) {
    return empty != null
           ? this.reduce((acc, x) => acc.concat(x), empty)
           : this.reduce((acc, x) => acc.concat(x))
  },
  foldMap : function(f, empty) {
    return this.map(f).fold(empty)
  },
  sequence : function(point) {
    return this.traverse(point, x => x)
  }
}

// List
//====================

// monoid
List.empty = List()
List.prototype.empty = List.empty

// traversable
List.prototype.traverse = function(point, f) {
  return this.reduce((ys, x) =>
    f(x).map(x => y => y.concat([x])).ap(ys), point(List()))
}

List.prototype.sequence = derived.sequence

// foldable
List.prototype.fold = derived.fold
List.prototype.foldMap = derived.foldMap

// applicative
List.prototype.ap = function(other) {
  return this.map(f => other.map(x => f(x))).flatten()
}

// monad
List.prototype.chain = List.prototype.flatMap;



// Map
//===============


// semigroup
Map.prototype.concat = function(other) {
  return this.mergeWith((prev, next) => prev.concat(next), other)
}

// monoid
Map.empty = Map({})
Map.prototype.empty = Map.empty

// foldable
Map.prototype.fold = derived.fold
Map.prototype.foldMap = derived.foldMap

// traverable
Map.prototype.traverse = function(point, f) {
  return this.reduce((acc, v, k) =>
    f(v, k).map(x => y => y.merge({[k]: x})).ap(acc), point(Map.empty))
}

Map.prototype.sequence = derived.sequence

// monad
Map.prototype.chain = Map.prototype.flatMap

module.exports = Immutable
