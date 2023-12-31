export enum MainRoutes {
  Home = 'home',
  Post = 'post',
}

export enum HomeRoutes {
  Home = 'list-posts',
  ViewPost = 'view-post',
  EditPost = 'edit-post',
}

export interface Route {
  route: string;
  path: string;
  slug?: string;
  children?: Route[];
}
