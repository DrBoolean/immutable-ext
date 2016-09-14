# immutable-ext
fantasyland extensions for immutablejs

# Install
`npm install immutable-ext`


# What is this?

In addition to the Functor, Foldable, and Monad functions, we now have:
 * Monoid
 * Applicative (list only right now)
 * Traversable

Plus stuff that builds off of reduce like `foldMap`. Please contribute/complain as you want/need things.

## Examples

We can now traverse without messing with Array or Object:

```js
  const { List, Map } = require('immutable-ext')
  const Task = require('data.task')
  const IO = require('fantasy-io')


  // Given Http.get :: String -> Task Error Blog

  List.of('/blog/1', '/blog/2')
    .traverse(Task.of, Http.get)
    .fork(console.error, console.log)
  // List(Blog, Blog)


  Map({home: "<div>homepage</div>", faq: "<p>ask me anything</p>"})
    .traverse(IO.of, (v, k) => new IO(v => $('body').append(v)))

  // IO(Map({home: "[dom]", faq: "[dom]"})
```

We can `fold` stuff down

```js
const {Disjunction, Additive} = require('fantasy-monoids')

List.of([1,2,3], [4,5,6]).fold([])
//[1,2,3,4,5,6]

Map({a: "hidy", b: "hidy", c: "ho"}).fold("")
// "hidyhidyho"


List.of(Map({a: Additive(1), b: Disjunction(true), c: "son", d: [1], e: 'wut'}),
        Map({a: Additive(2), b: Disjunction(false), c: "ofa", d: [2]}),
        Map({a: Additive(3), b: Disjunction(false), c: "gun", d: [3]})).fold(Map.empty),

// Map({a: Additive(6), b: Disjunction(true), c: "sonofagun", d: [1,2,3], e: 'wut'})))
```

`foldMap` some things

```js
List.of(1,2,3,4).foldMap(Additive, Additive.empty)
// Additive(10)

Map({a: true, b: false}).foldMap(Disjunction, Disjunction.empty)
// Disjunction(true)
```

We can `ap` to get us some list comprehensions

```js
List.of(x => y => x + y)
    .ap(List.of('a', 'b', 'c'))
    .ap(List.of('+', '-'))

// List('a+', 'a-', 'b+', 'b-', 'c+', 'c-')
```
