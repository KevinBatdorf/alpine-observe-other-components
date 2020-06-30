# Alpine — Observe Other Components
A lightweight observer function for Alpine.js that lets you monitor state on other Alpine components, including parent components.

![GitHub file size in bytes](https://img.shields.io/github/size/kevinbatdorf/alpine-observe-other-components/dist/index.js?label=minified&style=flat-square)
![GitHub tag (latest by date)](https://img.shields.io/github/v/tag/kevinbatdorf/alpine-observe-other-components?label=version&style=flat-square)

## About

Useful when you want to watch updates on child elements, or when you need to watch state in general.

#### Watch everything
Add `x-alpine-observe` attribute with the function name. Each component with this attribute will watch all other components and run your function every time.
```html
<div x-data="{text:'bar'}" @click="text = 'baz'" x-text="text"></div>

<!-- The component below is watching the component above for changes -->
<div x-data="{foo:'bar', go(details) { this.foo = details.data[0].text }}" x-alpine-observe="go" x-text="foo"></div>
```
[Demo](https://codepen.io/KevinBatdorf/pen/c7439ba7c47cb84464cf9409e289641c)

#### Watch only specific components
Add `x-alpine-observe` attribute with an object to specify a selector. Only components with this selector will be monitored for changes. Note that changes occur on initial load so the example below will first show `1`, not `0`.
```html
<div
  class="counters"
  x-data="{text:'bar'}"
  @click="text = text === 'baz' ? 'bar' : 'baz'"
  x-text="text">Watched</div>

<div
  x-data="{text:'bar'}"
  @click="text = text === 'baz' ? 'bar' : 'baz'"
  x-text="text">Not watched</div>

<!-- The component below is watching only the component above with a class of counters for changes -->
<div
  x-data="{count:0, go(details) { this.count++ }}"
  x-alpine-observe="{selector: '.counters', callback: 'go'}"
  x-text="count"></div>
```
[Demo](https://codepen.io/KevinBatdorf/pen/1100d05938a0a2ed51f2e391c6b8cf68)

#### Watch parent components
Similar to above, you can scope the child to only watch the parent for changes.
```html
<div 
  id="parent" 
  x-data="{text: 'parent'}">
  <div>
    Parent: <button
      @click="text = text === 'parent' ? 'also parent' : 'parent'"
      x-text="text"></button>
  </div>
  <div>
    Nested <button 
      x-data="{ text: 'child', getDataFromParent(details) { this.text = `${details.data[0].text}` } }"
      x-alpine-observe="{selector: '#parent', callback: 'getDataFromParent'}"
      @click="text = text === 'child' ? 'also child' : 'child'">
      <span x-text="text"></span>
  </button>
  </div>
</div>
```
[Demo](https://codepen.io/KevinBatdorf/pen/1c6c57ed30a79ca26a934a702d3f6095)

## Installation

Include the following `<script>` tag in the `<head>` of your document (before Alpine):

```html
<script src="https://cdn.jsdelivr.net/gh/kevinbatdorf/alpine-observe-other-components@0.x.x/dist/index.js"></script>
```

### Manual

If you wish to create your own bundle:

```bash
npm install kevinbatdorf/alpine-observe-other-components --save
```

Then add the following to your script:

```javascript
import 'alpine-observe-other-components'
import 'alpinejs'
```

## License

Copyright (c) 2020 Kevin Batdorf

Licensed under the MIT license, see [LICENSE.md](LICENSE.md) for details.
