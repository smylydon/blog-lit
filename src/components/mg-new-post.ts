import {LitElement, html} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {Post} from '../global/post';

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
    return html`
      <span>
        <mg-form
          ><mg-input value="3" label="testing"></mg-input
          ><mg-input value="3ddd" label="hahaha"></mg-input> </mg-form
      ></span>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mg-new-post': MgNewPost;
  }
}
