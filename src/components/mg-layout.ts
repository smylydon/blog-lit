import {LitElement, html} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {when} from 'lit/directives/when.js';
import styles from './mg-layout.scss';
import {PostEvent, PostEventPayload} from '../global';

import {MainRoutes, HomeRoutes, Route} from '../global/routes';
import {cloneObject, PostActions, store, UserActions} from '../global';

const routes: Route[] = [
  {
    route: MainRoutes.Home,
    path: '/home',
    children: [
      {
        route: HomeRoutes.EditPost,
        path: '/edit',
        slug: '',
      },
      {
        route: HomeRoutes.ViewPost,
        path: '/view',
        slug: '',
      },
    ],
  },
  {
    route: MainRoutes.Post,
    path: '/post',
  },
];

/**
 * A blog layout element.
 *
 */
@customElement('mg-layout')
export class MgLayout extends LitElement {
  static override styles = styles;

  @property({attribute: false})
  route = MainRoutes.Home;

  @property()
  view = HomeRoutes.Home;

  @property()
  postId: string | undefined;

  constructor() {
    super();

    // Handle forward/back buttons
    window.addEventListener('popstate', this.popstate.bind(this));
    this.addEventListener(HomeRoutes.ViewPost, this.changeView);
    this.addEventListener(HomeRoutes.EditPost, this.changeView);
    this.addEventListener(PostEvent.IncrementReaction, this.incrementReaction);
    this.addEventListener(PostEvent.DeletePost, this.deletePost);
    this.addEventListener(PostEvent.SavePost, this.savePost);
    this.addEventListener(PostEvent.UpdatePost, this.updatePost);
  }

  disconnectedCallback() {
    window.removeEventListener('popstate', this.popstate);
    this.removeEventListener(HomeRoutes.ViewPost, this.changeView);
    this.removeEventListener(HomeRoutes.EditPost, this.changeView);
    this.removeEventListener(
      PostEvent.IncrementReaction,
      this.incrementReaction
    );
    this.removeEventListener(PostEvent.DeletePost, this.deletePost);
    this.removeEventListener(PostEvent.SavePost, this.savePost);
    this.removeEventListener(PostEvent.UpdatePost, this.updatePost);
    super.disconnectedCallback();
  }

  changeView(event: CustomEvent) {
    event.stopImmediatePropagation();
    const id = event.detail.id;
    const type = event.type as HomeRoutes;
    this.view = type;
    this.postId = id;
  }

  incrementReaction(event: CustomEvent) {
    const detail: PostEventPayload = event.detail;
    store.dispatch(
      PostActions.incrementReaction({
        postId: detail.postId,
        post: detail.post,
      })
    );
  }

  deletePost(event: CustomEvent) {
    const detail: PostEventPayload = event.detail;
    store.dispatch(
      PostActions.deletePost({
        postId: detail.postId,
        post: detail.post,
      })
    );
    this.route = MainRoutes.Home;
    this.view = HomeRoutes.Home;
  }

  savePost(event: CustomEvent) {
    const detail: PostEventPayload = event.detail;
    store.dispatch(
      PostActions.savePost({
        postId: detail.postId,
        post: detail.post,
      })
    );
    this.route = MainRoutes.Home;
    this.view = HomeRoutes.Home;
  }

  updatePost(event: CustomEvent) {
    const detail: PostEventPayload = event.detail;
    store.dispatch(
      PostActions.updatePost({
        postId: detail.postId,
        post: detail.post,
      })
    );
  }

  private _onClickHome(event: Event) {
    event.preventDefault();
    this.route = MainRoutes.Home;
    this.view = HomeRoutes.Home;
  }

  private _onClickPost(event: Event) {
    event.preventDefault();
    this.route = MainRoutes.Post;
  }

  protected override firstUpdated(): void {
    store.dispatch(PostActions.loadPosts());
    store.dispatch(UserActions.loadUsers());
  }

  override updated() {
    this.routeHistory();
  }

  // Handle forward/back buttons
  private popstate(event: PopStateEvent) {
    if (event.state) {
      const route: Route = event.state as Route;
      const mainRoute = route.route as MainRoutes;
      if (route.children) {
        const childRoute = route.children[0];
        const subRoute = childRoute.route as HomeRoutes;
        const postId = childRoute.path.split('/').reverse()[0];
        this.route = mainRoute;
        this.view = subRoute;
        this.postId = postId;
      } else {
        this.route = mainRoute;
        this.view = HomeRoutes.Home;
      }
    }
  }

  private routeHistory() {
    const currentRoute = this.route;
    const main = routes.find((route: Route) => route.route === currentRoute);
    if (main) {
      const children = main.children;
      const newRoute = cloneObject(main);
      const childRoute = this.view;
      const child = children
        ? children.find((child: Route) => child.route === childRoute)
        : undefined;
      const newChild = child ? cloneObject(child) : undefined;
      if (newChild) {
        newChild.path += '/' + this.postId;
      }
      const url = newRoute.path + (newChild ? newChild.path : '');
      newRoute.children = newChild ? [newChild] : undefined;

      history.pushState(newRoute, '', url);
    }
  }

  override render() {
    const output = when(
      this.route === MainRoutes.Post,
      () => html`<mg-new-post />`,
      () => html`<mg-home view="${this.view}" postId="${this.postId}" />`
    );

    return html`
      <header>
        <h1>Redux Blog</h1>
        <nav>
          <ul>
            <li>
              <a @click=${this._onClickHome}>Home</a>
            </li>
            <li>
              <a @click=${this._onClickPost}>Post</a>
            </li>
          </ul>
        </nav>
      </header>
      <main>${output}</main>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mg-layout': MgLayout;
  }
}
