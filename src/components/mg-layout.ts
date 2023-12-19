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

  @property({attribute: false})
  route = 'home';

  @property()
  view = 'list-post';

  @property()
  postId: string | undefined;

  constructor() {
    super();
    this.addEventListener('view-post', this.changeView);
    this.addEventListener('edit-post', this.changeView);
  }

  disconnectedCallback() {
    this.removeEventListener('view-post', this.changeView);
    this.removeEventListener('edit-post', this.changeView);
    super.disconnectedCallback();
  }

  changeView(event: CustomEvent) {
    event.stopImmediatePropagation();
    const id = event.detail.id;
    const type = event.type;
    this.view = type;
    this.postId = id;
  }

  private _onClickHome(event: Event) {
    event.preventDefault();
    this.route = 'home';
    this.view = 'list-post';
  }

  private _onClickPost(event: Event) {
    event.preventDefault();
    this.route = 'post';
  }

  override render() {
    const output = /post/i.test(this.route)
      ? html`<mg-post />`
      : html`<mg-home view="${this.view}" postId="${this.postId}" />`;

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
      <main>${output}</main>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mg-layout': MgLayout;
  }
}
