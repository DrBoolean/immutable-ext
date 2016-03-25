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

We can now traverse without messing with Array:

```js
  const { List } = require('immutable-ext')
  const Task = require('data.task')

  List.of('/blog/1', '/blog/2')
    .traverse(Task.of, Http.get)
    .fork(console.error, console.log)

  // [Blog1, Blog2]
```

We can fold stuff down

```js
List.of(Map({a: Sum(1), b: Any(true), c: "son", d: [1], e: 'wut'}),
        Map({a: Sum(2), b: Any(false), c: "ofa", d: [2]}),
        Map({a: Sum(3), b: Any(false), c: "gun", d: [3]})).fold(Map.empty),

// Map({a: Sum(6), b: Any(true), c: "sonofagun", d: [1,2,3], e: 'wut'})))
```


