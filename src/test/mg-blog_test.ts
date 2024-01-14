/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
import {MgLayout} from '../index';
import {MgBlog} from '../index';

import {fixture, assert} from '@open-wc/testing';
import {html} from 'lit/static-html.js';

describe('mg-blog', () => {
  it('is defined', () => {
    const el = document.createElement('mg-blog');
    assert.instanceOf(el, MgLayout);
  });

  it('renders with default values', async () => {
    const el = await fixture(html`<mg-layout></mg-layout>`);
    assert.shadowDom.equal(
      el,
      `
      <h1>Hello, World!</h1>
      <button part="button">Click Count: 0</button>
      <slot></slot>
    `
    );
  });

  it('renders with a set name', async () => {
    const el = await fixture(html`<mg-blog name="Test"></mg-blog>`);
    assert.shadowDom.equal(
      el,
      `
      <h1>Hello, Test!</h1>
      <button part="button">Click Count: 0</button>
      <slot></slot>
    `
    );
  });

  it('handles a click', async () => {
    const el = (await fixture(html`<mg-blog></mg-blog>`)) as MgLayout;
    const button = el.shadowRoot!.querySelector('button')!;
    button.click();
    await el.updateComplete;
    assert.shadowDom.equal(
      el,
      `
      <h1>Hello, World!</h1>
      <button part="button">Click Count: 1</button>
      <slot></slot>
    `
    );
  });

  it('styling applied', async () => {
    const el = (await fixture(html`<mg-blog></mg-blog>`)) as MgBlog;
    await el.updateComplete;
    assert.equal(getComputedStyle(el).paddingTop, '16px');
  });
});
