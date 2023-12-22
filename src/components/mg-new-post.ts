import {LitElement, html} from 'lit';
import {customElement, property, state} from 'lit/decorators.js';
import {Post} from '../global/post';
import {items} from '../global/users';
import {Form, FormItem, ValidatorType} from '../global/form';

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

  @state()
  postTitle: FormItem = {
    type: 'input',
    name: 'postTitle',
    value: '',
    validator: {
      valid: false,
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
      valid: false,
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
      valid: false,
      type: ValidatorType.exists,
    },
  };

  @state()
  form: Form = {
    name: 'editForm',
    valid: false,
    formItems: [this.postAuthor, this.postContent, this.postTitle],
  };

  override render() {
    const form = JSON.stringify(this.form);
    const postAuthor = JSON.stringify(this.postAuthor);
    const postContent = JSON.stringify(this.postContent);
    const postTitle = JSON.stringify(this.postTitle);
    const values = JSON.stringify(items);

    return html`
      <section>
        <mg-form name="addForm" title="New Post" form=${form}>
          <mg-input
            label="Post Title:"
            name="postTitle"
            value=""
            validator=${postTitle}
          >
          </mg-input>
          <mg-selector
            name="postAuthor"
            items=${values}
            initialIid="0"
            label="Author:"
            validator=${postAuthor}
          >
          </mg-selector>
          <mg-textarea
            label="Content:"
            name="postContent"
            validator=${postContent}
          >
          </mg-textarea>
          <button type="button">Save Post</button>
        </mg-form>
      </section>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mg-new-post': MgNewPost;
  }
}
