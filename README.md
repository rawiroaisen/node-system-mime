# Node system-mime
Get the mimetype of a file in the xdg way.<br>
For more info see http://standards.freedesktop.org/shared-mime-info-spec/shared-mime-info-spec-latest.html

## Install
```
npm install system-mime
```

## Usage
```js
var mime = require('system-mime')

mime.lookup('file.txt') // 'text/plain'
mime.lookup('file.tar.gz') // 'application/x-compressed-tar'
mime.lookup('/path/file.tar') // 'application/x-tar'
mime.lookup('makefile') // 'text/x-makefile'

mime.lookup('unknown-type') // null

mime.fallback_type = 'text/plain' // (defaults to null)
mime.lookup('unknown-type') // 'text/plain'

mime.lookup('unknown-type', fallback) // fallback
```

## TODO
Read magic data