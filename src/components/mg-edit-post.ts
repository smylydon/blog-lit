import {LitElement, html} from 'lit';
import {customElement, property, state} from 'lit/decorators.js';
import {when} from 'lit/directives/when.js';
import styles from './mg-new-post.scss';

import {Post} from '../global/post';
import {items} from '../global/users';
import {Form, FormEvent, FormItem, ValidatorType} from '../global/form';

@customElement('mg-edit-post')
export class MgEditPost extends LitElement {
  static override styles = styles;

  @property({attribute: 'post'})
  set setPost(post: string) {
    this.model = JSON.parse(post);
  }

  @property({attribute: false})
  model: Post = {
    title: '',
    userId: 0,
    body: '',
    name: '',
    id: 0,
  } as Post;

  @state()
  postTitle: FormItem = {
    type: 'input',
    name: 'postTitle',
    value: '',
    validator: {
      valid: true,
      type: ValidatorType.length,
      length: 3,
    },
  };

  @state()
  postContent: FormItem = {
    type: 'textarea',
    name: 'postContent',
    value: '',
    validator: {
      valid: true,
      type: ValidatorType.length,
      length: 3,
    },
  };

  @state()
  postAuthor: FormItem = {
    type: 'selector',
    name: 'postAuthor',
    value: 0,
    validator: {
      valid: true,
      type: ValidatorType.exists,
    },
  };

  @state()
  form: Form = {
    name: 'editForm',
    valid: true,
    formItems: [this.postAuthor, this.postContent, this.postTitle],
  };

  firstUpdated() {
    this.addEventListener(FormEvent.updated, this.formUpdated);
  }

  disconnectedCallback() {
    this.removeEventListener(FormEvent.updated, this.formUpdated);
    super.disconnectedCallback();
  }

  formUpdated(e: CustomEvent) {
    if (e.detail.name === 'editForm') {
      this.form = e.detail.form;
    }
  }

  override render() {
    const form = JSON.stringify(this.form);
    const postAuthor = JSON.stringify(this.postAuthor);
    const postContent = JSON.stringify(this.postContent);
    const postTitle = JSON.stringify(this.postTitle);
    const values = JSON.stringify(items);
    const button = when(
      this.form.valid,
      () => html` <button type="button">Save Post</button>`,
      () => html` <button type="button" disabled>Save Post</button>`
    );

    return html`
      <section>
        <h2>Edit Post</h2>
        <mg-form name="editForm" title="Edit Post" form=${form}>
          <mg-input
            label="Post Title:"
            name="postTitle"
            value=${this.model.title}
            validator=${postTitle}
          >
          </mg-input>
          <mg-selector
            name="postAuthor"
            items=${values}
            value=${this.model.userId}
            label="Author:"
            validator=${postAuthor}
          >
          </mg-selector>
          <mg-textarea
            label="Content:"
            name="postContent"
            value=${this.model.body}
            validator=${postContent}
          >
          </mg-textarea>
          ${button}
          <button class="delete-button" type="button">Delete Post</button>
        </mg-form>
      </section>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mg-edit-post': MgEditPost;
  }
}
