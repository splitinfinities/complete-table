/**
 * This is an autogenerated file created by the Stencil build process.
 * It contains typing information for all components that exist in this project
 * and imports for stencil collections that might be configured in your stencil.config.js file
 */


declare global {
  interface HTMLStencilElement extends HTMLElement {
    componentOnReady(): Promise<this>;
    componentOnReady(done: (ele?: this) => void): void;
  }
}



import {
  CompleteTable as CompleteTable
} from './components/complete-table/complete-table';

declare global {
  interface HTMLCompleteTableElement extends CompleteTable, HTMLStencilElement {
  }
  var HTMLCompleteTableElement: {
    prototype: HTMLCompleteTableElement;
    new (): HTMLCompleteTableElement;
  };
  interface HTMLElementTagNameMap {
    "complete-table": HTMLCompleteTableElement;
  }
  interface ElementTagNameMap {
    "complete-table": HTMLCompleteTableElement;
  }
  namespace JSX {
    interface IntrinsicElements {
      "complete-table": JSXElements.CompleteTableAttributes;
    }
  }
  namespace JSXElements {
    export interface CompleteTableAttributes extends HTMLAttributes {
      density?: string|"comfortable"|"cozy"|"compact";
      editable?: boolean;
      expandable?: boolean;
      expandInto?: string|"row"|"side-panel"|"dialog";
      filterable?: boolean;
      history?: boolean;
      items?: number;
      pagination?: boolean;
      raw?: boolean;
      readability?: string|"border"|"even"|"odd";
      resizable?: boolean;
      searchable?: boolean;
      selectable?: boolean;
      sortable?: boolean;
      sticky?: boolean;
    }
  }
}

declare global { namespace JSX { interface StencilJSX {} } }
