import {LitElement, html} from 'lit';
import {customElement} from 'lit/decorators.js';

import {MgPostBase} from './mg-post-base';

import {Post} from '../global/post';
import {HomeRoutes} from '../global/routes';
import styles from './mg-post.scss';

@customElement('mg-post-single')
export class MgPostSingle extends MgPostBase(LitElement) {
  static override styles = styles;

  override getBody(post: Post) {
    const body = post.body ?? '';
    return html` <h3>${post.title}</h3>
      <p>${body}</p>`;
  }

  override getLink() {
    return html` <a @click=${this._onClickEdit}>Edit Post</a>`;
  }

  override render() {
    return this.renderOuput(this.model);
  }

  private _onClickEdit(event: Event) {
    event.preventDefault();
    this.dispatchEvent(this.getEventObject(HomeRoutes.EditPost));
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mg-post-single': MgPostSingle;
  }
}
