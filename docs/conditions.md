# Conditions

## Simplest condition specification
```
{
  operator: "equal",
  lhs: 1,
  rhs: 1
}
```
1. Conditions can include sets of `any` or `all`
1. A condition may specify an `operator`
1. If an `operator` is specified, the `lhs` and `rhs` properties must exist

## Operators
1. An operator specification can be a string representing an `operator` name
1. An operator specification can be an object with a single property of `not`.
The value of the `not` property is the actual operator.
1. Operators can include a property on the `condition` named `info` which can contain extra info
about the evaluation of the operator.

### Example of not operator specification
```
{
  operator: {
    not : "equal"
  },
  lhs: 1,
  rhs: 1
}
```
### Built-In Operators
* `equal`
* `greatherThan`
* `lessThan`
* `in` - Tests if a single value or a sebset of values in the `lhs` exist in
the `rhs`
* `regex` - Tests if the regex pattern in `lhs` matches the value of `rhs`.
Remember to double escape `\\` special characters in the double quoted string.
The `regex` operator will also output any strings captured from the evaluation in the `info` property

## Values (`lhs` and `rhs`)
All condition operations use values to evaluate the condition. The `lhs`
and `rhs` value specifications are those values.
1. A value can be a constant
1. A value can have a path specification. `path` specifications use the `lodash`
library for path resolution using `_.get`.
1. A value can be an exists specification. `exists` specifications use the `lodash`
library for path resolution using `_.has`.

### Example of `path` specification 
```
{
  operator: {
    not : "equal"
  },
  lhs: {
    path: "prop1.prop2"
  },
  rhs: 1
}
```

### Example of `exists` specification 
```
{
  operator: "equal",
  lhs: {
    exists: "prop1.prop2"
  },
  rhs: true
}
```

## Depedencies
A condition can include an optional `depends` attribute which must either be a single string or an array of strings.
A dependent string value will be evaluated against any other conditions who included an optional `id` property in the
condition statement.

