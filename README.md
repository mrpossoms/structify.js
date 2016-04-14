# structify.js
structify.js converts JS objects into Buffers which can be easily understood as C/C++ structs. structify.js was written for use cases where a node server finds itself communicating with a client written in a low-level language. For example, an iOS chat app communicating over a TCP/IP socket.
## Requirements
* node.js >= v4.2.4

## Usage
structify.js is meant to translate flat JS objects, composed of C-like primitive types into Buffers with ease. For example...
```JavaScript
var author = {
  accType: 0,
  username: 'mrpossoms',
  rating: 0.75,
};
```
Can be serialized using...
```JavaScript
require('structify');

// The layout specifies the order that JS
// object properties will be written into the buffer.
var layout = [
  { name: 'accType', type: 'u8' },
  { name: 'rating',   type: 'f' },
  { 
    name: 'username', // JS object property name
    type: 'u8',       // Binary data type
    size: author.username.length + 1 // use an extra byte for null termination
  }
];

// endianess of all the properties can be set like this
layout.isBigEndian = false; 

var buf = author.structify(layout);
```
The contents of `buf` will look like this.
```
<Buffer 00 00 00 40 3f 6d 72 70 6f 73 73 6f 6d 73 00>
// or as a string
'\u0000\u0000\u0000@?mrpossoms\u0000'
```
*Note: All buffers allocated with .structify() are zero filled.*

##Compatible Types
Currently structify.js can write integer types, floating points, and character buffers. They are defined using a simple text format. The first character specifies the type. The type is then suffixed by the number of bits of precision desired (u8, i16, u32, f, or d).

* u [*precision*] - Unsigned integer
* i [*precision*] - Signed integer
* f - Float
* d - Double

*Note: floating point types cannot be given a bit precision*
