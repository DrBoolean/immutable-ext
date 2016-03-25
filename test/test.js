const assert = require("assert")
const daggy = require("daggy")
const Immutable = require("immutable")
const Identity = require("fantasy-identities")
const {List, Map} = require('../index')

// for fold tests
const Sum = daggy.tagged('val')
Sum.prototype.concat = function(o) { return Sum(o.val + this.val) }
Sum.empty = Sum(0)

const Any = daggy.tagged('val')
Any.prototype.concat = function(o) { return Any(o.val || this.val) }
Any.empty = Any(false)



describe("Maps", function() {
  const simple = Map({name: "brian", age: Sum(30)})

  it('concats the vals', () =>
    assert.deepEqual(
      simple.concat(Map({name: "lonsdorf", age: Sum(30), extra: true})),
      Map({name: "brianlonsdorf", age: Sum(60), extra: true})))

  it('folds (via list)', () =>
    assert.deepEqual(
      List.of(Map({a: Sum(1), b: Any(true), c: "son", d: [1], e: 'wut'}),
              Map({a: Sum(2), b: Any(false), c: "ofa", d: [2]}),
              Map({a: Sum(3), b: Any(false), c: "gun", d: [3]})).fold(Map.empty),

      Map({a: Sum(6), b: Any(true), c: "sonofagun", d: [1,2,3], e: 'wut'})))

  it('toLists', () =>
    assert.deepEqual(
      Map({a: 1, b: 2}).toList()
      [['a', 1], ['b', 2]]))
})

describe("List", function() {
  const list = List.of('a', 'b', 'c', 'd')

  it('applies the list', () =>
    assert.deepEqual(
      List.of(x => y => x + y).ap(list).ap(List.of('+', '-')).toJS(),
      List.of('a+', 'a-', 'b+', 'b-', 'c+', 'c-', 'd+', 'd-').toJS()))

  it('traverses the list', () =>
    assert.deepEqual(
      list.traverse(Identity.of, Identity.of),
      Identity.of(list)))

  it('folds the list to a value if holding monoids', () =>
    assert.deepEqual(list.fold(''), 'abcd'))

  it('foldMaps the list', () =>
    assert.deepEqual(List.of(1,2,3).foldMap(Sum), Sum(6)))
})
