# specialkey-emulator
___

**Emulate special keys (e.g. brightness, play/pause, increase volume) by emitting low-level global keyboard events - using NodeJS.**

Contents
----
1. [Supported Platforms](#supported-platforms)
1. [Requirements](#requirements)
1. [Roadmap](#roadmap) 
1. [Installation](#installation)
1. [Usage](#usage)
1. [API](#api) 
1. [List of Special Key Names](#list-of-special-key-names)
1. [Author](#author)
1. [License](#license)

<a name="supported-platforms"></a>Supported Platforms
----

Currently OSX only (see [Roadmap](#roadmap)).  
Tested on OSX 10.13 and 10.14.


<a name="requirements"></a>Requirements
----

Node 10.0.0+


<a name="roadmap"></a>Roadmap
----
 - Windows version, see [Virtual Keycodes (Microsoft Developer Network)](https://msdn.microsoft.com/en-us/library/windows/desktop/dd375731.aspx)


<a name="installation"></a>Installation
----

```sh
npm install specialkey-emulator --save
```


<a name="usage"></a>Usage
----

To trigger a key, simply require the module and directly call it with the name of the key to be triggered. See [List of Special Key Names](#list-of-special-key-names) for a list of currently supported keys.


### Simple usage

```javascript
specialkey = require('specialkey-emulator');

specialkey('NX_KEYTYPE_ILLUMINATION_DOWN')
```

### Callback usage

```javascript
specialkey = require('specialkey-emulator');

specialkey('NX_KEYTYPE_ILLUMINATION_DOWN', function (err, result) {
    if (err) {
        return console.log('Error', err);
    }
    console.log('Key triggered', result);
})
```

<a name="api"></a>API
----

### Overview
This module directly exports itself as a function:

```javascript
require('specialkey-emulator')(keyName, callback)
```

### Parameters
It takes the following parameters:

- **keyName** (String) - Name of the key to be triggered. See [List of Special Key Names](#list-of-special-key-names).
- **callback** (Function) - Called after trying to trigger the special key.
  - error (Error) - Error
  - result (Number) - Internal code of the key which was called.

<a name="list-of-special-key-names"></a>List of Special Key Names
----

### OSX
- Reference: [Darwin Keyboard Events @ opensource.apple.com](http://www.opensource.apple.com/source/IOHIDFamily/IOHIDFamily-86.1/IOHIDSystem/IOKit/hidsystem/ev_keymap.h)
- Names	
	- NX\_KEYTYPE\_SOUND\_UP 
	- NX\_KEYTYPE\_SOUND\_DOWN 
	- NX\_KEYTYPE\_BRIGHTNESS\_UP 
	- NX\_KEYTYPE\_BRIGHTNESS\_DOWN 
	- NX\_KEYTYPE\_CAPS\_LOCK 
	- NX\_KEYTYPE\_HELP 
	- NX\_KEYTYPE\_POWER\_KEY 
	- NX\_KEYTYPE\_MUTE 
	- NX\_KEYTYPE\_UP\_ARROW\_KEY 
	- NX\_KEYTYPE\_DOWN\_ARROW\_KEY 
	- NX\_KEYTYPE\_NUM\_LOCK 
	- NX\_KEYTYPE\_CONTRAST\_UP 
	- NX\_KEYTYPE\_CONTRAST\_DOWN 
	- NX\_KEYTYPE\_LAUNCH\_PANEL 
	- NX\_KEYTYPE\_EJECT 
	- NX\_KEYTYPE\_VIDMIRROR 
	- NX\_KEYTYPE\_PLAY 
	- NX\_KEYTYPE\_NEXT 
	- NX\_KEYTYPE\_PREVIOUS 
	- NX\_KEYTYPE\_FAST 
	- NX\_KEYTYPE\_REWIND 
	- NX\_KEYTYPE\_ILLUMINATION\_UP 
	- NX\_KEYTYPE\_ILLUMINATION\_DOWN 
	- NX\_KEYTYPE\_ILLUMINATION\_TOGGLE


<a name="author"></a>Author
----
[sidneys.github.io](http://sidneys.github.io) 2018


<a name="license"></a>License
----

MIT
