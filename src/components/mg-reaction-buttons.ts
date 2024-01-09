import {LitElement, html} from 'lit';
import {customElement, property} from 'lit/decorators.js';

import {Post, PostEvent} from '../global/post';
import styles from './mg-reaction-buttons.scss';

@customElement('mg-reaction-buttons')
export class MgReactionButtons extends LitElement {
  static override styles = styles;

  @property({attribute: 'post'})
  set setPost(post: string) {
    this.model = JSON.parse(post);
  }

  @property({attribute: false})
  model: Post = {
    id: 0,
    title: '',
    userId: 0,
    body: '',
    date: '',
    reactions: {
      thumbsUp: 0,
      wow: 0,
      heart: 0,
      rocket: 0,
      coffee: 0,
    },
  } as Post;

  reactionEmoji = {
    thumbsUp: '👍',
    wow: '😮',
    heart: '❤️',
    rocket: '🚀',
    coffee: '☕',
  };

  override render() {
    const post = this.model;
    const buttons = Object.entries(post.reactions).map(([emoji, value]) => {
      const item = html`${this.reactionEmoji[emoji]}${value}`;
      return html`<button
        type="button"
        class="reaction-button"
        @click=${{handleEvent: () => this._onClick(emoji), once: false}}
      >
        ${item}
      </button>`;
    });

    return html`<div>${buttons}</div>`;
  }

  _onClick(emoji: string) {
    const reactions = this.model.reactions;
    reactions[emoji] += 1;

    this.dispatchEvent(
      new CustomEvent(PostEvent.IncrementReaction, {
        detail: {
          postId: this.model.id,
          emoji,
          reactions,
        },
        bubbles: true,
        composed: true,
      })
    );
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mg-reaction-buttons': MgReactionButtons;
  }
}
