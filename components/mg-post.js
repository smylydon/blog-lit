var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
//import "./index.scss";
import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
/**
 * A blog element.
 *
 */
let MgPost = class MgPost extends LitElement {
    constructor() {
        super(...arguments);
        this.model = {
            title: '',
            userId: 0,
            body: '',
            name: '',
            id: 0,
        };
        this.isSingle = false;
    }
    set setPost(post) {
        this.model = JSON.parse(post);
    }
    render() {
        const post = this.model;
        let value = html `<a @click=${this._onClickNew}>View Post</a>`;
        if (this.isSingle) {
            value = html `<a @click=${this._onClickEdit}>Edit Post</a>`;
        }
        return html `<article>
      <h2>${post.title}</h2>
      <p class="excerpt">${post.body}...</p>
      <p class="post-credit">
        ${value}
        <span>${post.name}</span>
      </p>
    </article> `;
    }
    _onClickEdit(event) {
        event.preventDefault();
        console.log('edit-post');
        this.dispatchEvent(new CustomEvent('edit-post'));
    }
    _onClickNew(event) {
        event.preventDefault();
        console.log('new-post');
        this.dispatchEvent(new CustomEvent('new-post'));
    }
};
MgPost.styles = css `
    .post-credit {
      font-size: 1rem;
    }

    a {
      cursor: pointer;
    }

    .post-credit a,
    .post-credit a:visited {
      margin-right: 0.5rem;
      color: black;
    }

    .post-credit a:hover,
    .post-credit a:focus {
      color: hsla(0, 0%, 0%, 0.75);
    }

    .excerpt {
      font-style: italic;
    }
  `;
__decorate([
    property({ attribute: 'post' })
], MgPost.prototype, "setPost", null);
__decorate([
    property({ attribute: false })
], MgPost.prototype, "model", void 0);
__decorate([
    property({ type: Object, attribute: 'is-single' })
], MgPost.prototype, "isSingle", void 0);
MgPost = __decorate([
    customElement('mg-post')
], MgPost);
export { MgPost };
//# sourceMappingURL=mg-post.js.map