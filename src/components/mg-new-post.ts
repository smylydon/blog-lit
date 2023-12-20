import {LitElement, html} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {Post} from './post';

@customElement('mg-new-post')
export class MgNewPost extends LitElement {
  @property({attribute: false})
  model: Post = {
    title: '',
    userId: 0,
    body: '',
    name: '',
    id: 0,
  } as Post;

  override render() {
    return html` <span> &nbsp; <i></i> </span> `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mg-new-post': MgNewPost;
  }
}
