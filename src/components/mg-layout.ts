/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
import {LitElement, html} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import styles from './mg-layout.scss';

/**
 * A blog layout element.
 *
 */
@customElement('mg-layout')
export class MgLayout extends LitElement {
  static override styles = styles;
  /**
   * The number of times the button has been clicked.
   */
  @property({attribute: false})
  route = 'home';

  override render() {
    let route = html`<mg-home />`;
    if (/post/i.test(this.route)) {
      route = html`<mg-post />`;
    }
    return html`
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
      <main>${route}</main>
    `;
  }

  private _onClickHome(event: Event) {
    event.preventDefault();
    this.route = 'home';
    this.dispatchEvent(new CustomEvent('route-home'));
  }

  private _onClickPost(event: Event) {
    event.preventDefault();
    this.route = 'post';
    this.dispatchEvent(new CustomEvent('route-post'));
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mg-layout': MgLayout;
  }
}
