var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
/**
 * A blog layout element.
 *
 */
let MgLayout = class MgLayout extends LitElement {
    constructor() {
        super(...arguments);
        /**
         * The number of times the button has been clicked.
         */
        this.route = 'home';
    }
    render() {
        let route = html `<mg-home slot="slot1" />`;
        if (/post/i.test(this.route)) {
            route = html `<mg-post slot="slot1" />`;
        }
        return html `
      <header class="header">
        <h1>Redux Blog</h1>
        <nav>
          <ul>
            <li>
              <a @click=${this._onClickHome}>Home</a>
            </li>
            <li>
              <a @click=${this._onClickPost}>Post</a>
            </li>
          </ul>
        </nav>
      </header>
      <main class="App"><slot name="slot1"></slot> ${route}</main>
    `;
    }
    _onClickHome(event) {
        event.preventDefault();
        this.route = 'home';
        this.dispatchEvent(new CustomEvent('route-home'));
    }
    _onClickPost(event) {
        event.preventDefault();
        this.route = 'post';
        this.dispatchEvent(new CustomEvent('route-post'));
    }
};
MgLayout.styles = css `
    header {
      padding: 1rem;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      background-color: purple;
      color: whitesmoke;
      position: sticky;
      top: 0;
    }

    input,
    textarea,
    button,
    select {
      font: inherit;
      margin-bottom: 1em;
    }

    nav {
      display: flex;
      justify-content: flex-end;
    }

    nav ul {
      list-style-type: none;
    }

    nav ul li {
      display: inline-block;
      margin-right: 1rem;
    }

    a {
      cursor: pointer;
    }

    nav a,
    nav a:visited {
      color: #fff;
      text-decoration: none;
    }

    nav a:hover,
    nav a:focus {
      text-decoration: underline;
    }

    main {
      max-width: 500px;
      margin: auto;
      min-height: 100%;
    }

    section {
      margin-top: 1em;
    }

    article {
      margin: 0.5em;
      border: 1px solid #000;
      border-radius: 10px;
      padding: 1em;
    }

    h1 {
      font-size: 3.5rem;
    }

    h2 {
      margin-bottom: 1rem;
    }

    p {
      font-family: Arial, Helvetica, sans-serif;
      line-height: 1.4;
      font-size: 1.2rem;
      margin: 0.5em 0;
    }

    form {
      display: flex;
      flex-direction: column;
    }

    textarea {
      height: 200px;
    }

    .delete-button {
      background-color: palevioletred;
      color: white;
    }

    button[type='submit'],
    .delete-button {
      cursor: pointer;
      &:disabled {
        cursor: not-allowed;
      }
    }
  `;
__decorate([
    property({ attribute: false })
], MgLayout.prototype, "route", void 0);
MgLayout = __decorate([
    customElement('mg-layout')
], MgLayout);
export { MgLayout };
//# sourceMappingURL=mg-layout.js.map