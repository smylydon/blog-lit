import {LitElement, html} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {repeat} from 'lit/directives/repeat.js';
import {
  Post,
  PostActions,
  PostState,
  store,
  StoreInterface,
  StoreListenerInterface,
  connect,
} from '../global';
import {HomeRoutes} from '../global/routes';
import styles from './mg-home.scss';

/**
 * Home element.
 * display a list of posts.
 */
@customElement('mg-home')
export class MgHome
  extends connect(store)(LitElement)
  implements StoreListenerInterface
{
  static override styles = styles;

  @property()
  view = HomeRoutes.Home;

  @property()
  postId: string | undefined;

  @property({attribute: false})
  model: Post[] = [];

  stateChanged(store: StoreInterface) {
    const postState: PostState = store.select(PostActions.slice());
    const entities: Post[] = postState?.entities;
    this.model = entities ?? [];
  }

  protected override firstUpdated(): void {
    store.dispatch(PostActions.getPosts());
  }

  override render() {
    const isSinglePost = [HomeRoutes.ViewPost, HomeRoutes.EditPost].includes(
      this.view
    );
    const id = Number(this.postId);
    const postId = isFinite(id) ? id : undefined;

    let output;
    if (isSinglePost) {
      const post = this.model.find((post) => post.id === postId);
      const value = post ? JSON.stringify(post) : JSON.stringify({});
      if (this.view === HomeRoutes.ViewPost) {
        output = html`<mg-post-single post=${value} />`;
      } else if (this.view === HomeRoutes.EditPost) {
        // will add new component
        output = html`<mg-edit-post post=${value} />`;
      }
    } else {
      output = repeat(
        this.model,
        (post: Post) => post.id,
        (post: Post) => {
          const value = JSON.stringify(post);
          return html`<mg-post-list post=${value} />`;
        }
      );
    }
    return html`${output}`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mg-home': MgHome;
  }
}
