import {LitElement, TemplateResult, html} from 'lit';
import {property} from 'lit/decorators.js';
import {when} from 'lit/directives/when.js';

import {Post} from '../global/post';

/* eslint-disable  @typescript-eslint/no-explicit-any */
type Constructor<T> = new (...args: any[]) => T;
/* eslint-enable  @typescript-eslint/no-explicit-any */

export declare class MgPostBaseInterface {
  model: Post;
  set setPost(post: string);
  getEventObject(type: string): CustomEvent;
  getReactionButtons(post: Post): TemplateResult;
  getBody(post: Post): TemplateResult;
  getLink(): TemplateResult;
  renderOuput(post: Post): TemplateResult;
}

export const MgPostBase = <T extends Constructor<LitElement>>(
  superClass: T
) => {
  class MgPostBaseElement extends superClass {
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

    getEventObject(type: string): CustomEvent {
      return new CustomEvent(type, {
        detail: {
          id: this.model.id,
        },
        bubbles: true,
        composed: true,
      });
    }

    getReactionButtons(post: Post): TemplateResult {
      const reactions = when(
        post.reactions,
        () =>
          html`<mg-reaction-buttons
            post=${JSON.stringify(post)}
          ></mg-reaction-buttons>`,
        () => html`<mg-reaction-buttons></mg-reaction-buttons>`
      );
      return reactions;
    }

    getBody(post: Post): TemplateResult {
      console.error('getBody Error::', post);
      return html``;
    }

    getLink(): TemplateResult {
      console.error('getLink Error');
      return html``;
    }

    renderOuput(post: Post): TemplateResult {
      const reactions = this.getReactionButtons(post);
      const body = this.getBody(post);
      const link = this.getLink();

      return html`<article>
        ${body}
        <p class="post-credit">
          ${link}
          <span>${post.name}</span>
          <mg-time-ago timestamp="${post.date}"></mg-time-ago>
        </p>
        ${reactions}
      </article> `;
    }
  }

  return MgPostBaseElement as Constructor<MgPostBaseInterface> & T;
};
