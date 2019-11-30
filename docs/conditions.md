# Conditions

## Simplest condition specification
```
{
  operator: "equal",
  lhs: 1,
  rhs: 1
}
```
1. An operator must be specified. `Operators`
1. The `lhs` and `rhs` properties must exist

## Operators
1. An operator specification can be a string representing an operator
1. An operator specification can be an object with a single property of `not`.
The value of the `not` property is the actual operator.

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
* `in` - Tests if a single value or a sebset of values in the `lhs` exist in the `rhs`

## Values (`lhs` and `rhs`)
All condition operations use values to evaluate the condition. The `lhs` and `rhs` value specifications are those values.
1. A value can be a constant
1. A value can be a path specification. Path specifications use the `lodash`
library for path resolution.

### Example of path specification 
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

