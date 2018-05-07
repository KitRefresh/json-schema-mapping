# JSON Utilts - Schema Mapping

A json oriented package to transfrom a schema to another schema.

## Installation

`npm install --save jutils-schema-mapping`

or

`yarn add jutils-schema-mapping`

## Usage

1. Basic usage
```javascript
const { convert } = require('jutils-schema-mapping');

let output = convert(
  { name: "myName" },
  [                       // A series of mapping rules.
    {
      name: "__root__",   // Default entry rule name.
      rules: [
        ["$.name", "string.uppercase", "T.user.name"]
      ]
    }
  ]
)

/**
 * output = {
 *  user: {
 *    name: "MYNAME" 
 *  }
 * }
 */
```

2. More examples

    Please see those examples under the 'examples/' folder.

## Mapping rule schema
```typescript
export class StringStyledMappingRule {
  name: string;
  rules: Rule[];
}
```

## Pipe schema
1. Pull data

    Powered by [json-path](https://github.com/dchester/jsonpath)
  
2. Transform data
    
    *(TBD)*
3. Push data

    *(TBD)*