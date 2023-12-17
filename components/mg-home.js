var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
//import "./index.scss";
import { LitElement, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { posts } from './data';
/**
 * An example element.
 *
 */
let MgHome = class MgHome extends LitElement {
    constructor() {
        super(...arguments);
        this.posts = posts;
    }
    render() {
        const view = this.posts.map((post) => {
            return html `<mg-post issingle="true" post=${JSON.stringify(post)} />`;
        });
        return html `${view}`;
    }
};
__decorate([
    state()
], MgHome.prototype, "posts", void 0);
MgHome = __decorate([
    customElement('mg-home')
], MgHome);
export { MgHome };
//# sourceMappingURL=mg-home.js.map