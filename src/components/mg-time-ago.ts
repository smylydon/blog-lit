import {LitElement, html} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {TimeAgo} from '../global/time-ago';

/**
 * A time ago element.
 *
 */
@customElement('mg-time-ago')
export class MgTimeAgo extends LitElement {
  /**
   * The number of times the button has been clicked.
   */
  @property({type: String})
  timestamp = '';

  override render() {
    const timestamp = TimeAgo.transform(this.timestamp);

    return html`
      <span title="${timestamp}"> &nbsp; <i>${timestamp}</i> </span>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mg-time-ago': MgTimeAgo;
  }
}
