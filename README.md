# vue3-affix

Provides a simple, opinionated, directive implementation of affix, which works with vue 3 (and possibly vue 2).

### Prerequisites
* Vue 3

### Usage

Install like any other package:
```bash
$ npm install @nic/vue3-affix
```

Make sure you have the classes `hidden` and `fixed` available through CSS.
```css
.hidden { display: none; }
.fixed { position: fixed; }
```

Import and register 
```js
import Affix from "@nic/vue3-affix";

const app = createApp({ /* ... */});

app.directive("affix", Affix);

app.mount("#app")
```

Use it on an element
```html
<div id="app" style="height: 200vh;">
    <div style="height: 50vh;">
        <div v-affix>I will be affixed</div>
    </div>
</div>
```

### Considerations

This directive is a quick and dirty implementation of an `affix to top` pattern. The directive will recalculate sizes and positions every scroll tick which might impact performance.
