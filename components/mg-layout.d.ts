/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
import { LitElement } from 'lit';
/**
 * A blog layout element.
 *
 */
export declare class MgLayout extends LitElement {
    static styles: import("lit").CSSResult;
    /**
     * The number of times the button has been clicked.
     */
    route: string;
    render(): import("lit-html").TemplateResult<1>;
    private _onClickHome;
    private _onClickPost;
}
declare global {
    interface HTMLElementTagNameMap {
        'mg-layout': MgLayout;
    }
}
//# sourceMappingURL=mg-layout.d.ts.map