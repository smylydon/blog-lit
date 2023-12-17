import { LitElement } from 'lit';
import { Post } from './post';
/**
 * A blog element.
 *
 */
export declare class MgPost extends LitElement {
    static styles: import("lit").CSSResult;
    set setPost(post: string);
    model: Post;
    isSingle: boolean;
    render(): import("lit-html").TemplateResult<1>;
    private _onClickEdit;
    private _onClickNew;
}
declare global {
    interface HTMLElementTagNameMap {
        'mg-post': MgPost;
    }
}
//# sourceMappingURL=mg-post.d.ts.map