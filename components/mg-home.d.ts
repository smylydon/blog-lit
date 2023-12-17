import { LitElement } from 'lit';
import { Post } from './post';
/**
 * An example element.
 *
 */
export declare class MgHome extends LitElement {
    posts: Post[];
    render(): import("lit-html").TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'mg-home': MgHome;
    }
}
//# sourceMappingURL=mg-home.d.ts.map