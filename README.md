# JSon Rules Engine
There are several JSON rules engines avaialable so why build another one?
As usual, the ones out there were not really a good fit. So this package is
based on the following focus:

1. Use the latest ES7 based capabilities in the implementation to eliminate
unnecessary boiler plate
1. Focus on inspecting a single large JSON object that could come back from
an API or an object moving through a streaming platform
1. Allow for the use of YAML, it is just more concise
1. Lean on `AJV` for rule specification validation
1. Lean on `lodash` for a lot of heavy lifting
1. Like other rule engines, re-use the `rules` data structure to put the results
of calculation to make it easier to diagnose failures
1. In the results returned, returned a focused list of `errors` to simplify
diagnosing errors
 
# Example

```
test('example rule pass', () => {
  const testDocument = {
    prop1 : {
      prop2 : {
        prop3 : 1
      }
    }
  };
  
  const rules = [
    {
      conditions: {
        all: [
          {
            operator: "equal",
            lhs: 1,
            rhs: {
              path: "prop1.prop2.prop3"
            }
          }
        ]
      }
    }
  ];
  
  const engine = new Engine( { rules } );
  const results = engine.run( testDocument );
  expect(results).toHaveProperty('success');
  expect(results.success).toBe(true);
});
```

# Operators
Operators are very easy to add and are kept pluggable in a directory called
`operator`

# Requests
Requests for added functionality are welcome and will be implemented without
asking for pull requests or $ =)

#Docs
[Documentation](docs/conditions.md)
