/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */

import {LitElement, html, css} from 'lit';
import {customElement} from 'lit/decorators.js';

/**
 * An example element.
 *
 * @fires count-changed - Indicates when the count changes
 * @slot - This element has a slot
 * @csspart button - The button
 */
@customElement('mg-blog')
export class MgBlog extends LitElement {
  static override styles = css`
    /* You can add global styles to this file, and also import other style files */
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    html {
      font-family: Cambria, Cochin, Georgia, Times, 'Times New Roman', serif;
      background-color: white;
      color: #000;
    }

    body {
      min-height: 100vh;
      font-size: 1.5rem;
    }
  `;

  override render() {
    return html` <mg-layout></mg-layout> `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mg-blog': MgBlog;
  }
}
