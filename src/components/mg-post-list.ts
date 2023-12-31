import {LitElement, html} from 'lit';
import {customElement} from 'lit/decorators.js';

import {MgPostBase} from './mg-post-base';

import {Post} from '../global/post';
import {HomeRoutes} from '../global/routes';
import styles from './mg-post.scss';

@customElement('mg-post-list')
export class MgPostList extends MgPostBase(LitElement) {
  static override styles = styles;

  override getBody(post: Post) {
    const body = post.body ?? '';
    return html` <h2>${post.title}</h2>
      <p class="excerpt">${body.substring(0, 75)}...</p>`;
  }

  override getLink() {
    return html` <a @click=${this._onClickView}>View Post</a>`;
  }

  override render() {
    return this.renderOuput(this.model);
  }

  private _onClickView(event: Event) {
    event.preventDefault();
    this.dispatchEvent(this.getEventObject(HomeRoutes.ViewPost));
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mg-post-list': MgPostList;
  }
}
