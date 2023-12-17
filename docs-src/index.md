---
layout: page.11ty.cjs
title: <mg-blog> ⌲ Home
---

# &lt;mg-blog>

`<mg-blog>` is an awesome element. It's a great introduction to building web components with LitElement, with nice documentation site as well.

## As easy as HTML

<section class="columns">
  <div>

`<mg-blog>` is just an HTML element. You can it anywhere you can use HTML!

```html
<mg-blog></mg-blog>
```

  </div>
  <div>

<mg-blog></mg-blog>

  </div>
</section>

## Configure with attributes

<section class="columns">
  <div>

`<mg-blog>` can be configured with attributed in plain HTML.

```html
<mg-blog name="HTML"></mg-blog>
```

  </div>
  <div>

<mg-blog name="HTML"></mg-blog>

  </div>
</section>

## Declarative rendering

<section class="columns">
  <div>

`<mg-blog>` can be used with declarative rendering libraries like Angular, React, Vue, and lit-html

```js
import {html, render} from 'lit-html';

const name = 'lit-html';

render(
  html`
    <h2>This is a &lt;mg-blog&gt;</h2>
    <mg-blog .name=${name}></mg-blog>
  `,
  document.body
);
```

  </div>
  <div>

<h2>This is a &lt;mg-blog&gt;</h2>
<mg-blog name="lit-html"></mg-blog>

  </div>
</section>
