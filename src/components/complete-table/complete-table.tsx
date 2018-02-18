import { Component, Prop, State, Element, Method } from '@stencil/core';
import Swappable from '@shopify/draggable/lib/swappable';

@Component({
  tag: 'complete-table',
  styleUrl: 'complete-table.css'
})
export class CompleteTable {
  @Element() element: HTMLElement;

  @Prop() sticky: boolean;
  @Prop() raw: boolean = false;
  @Prop() swappable: boolean = false;
  @Prop() sortable: boolean = false;
  @Prop() resizable: boolean = false;
  @Prop() filterable: boolean = false;
  @Prop() searchable: boolean = false;
  @Prop() editable: boolean = false;
  @Prop() expandable: boolean = false;
  @Prop() selectable: boolean = false;
  @Prop() readability: string|"border"|"even"|"odd" = undefined;
  @Prop() density: string|"comfortable"|"cozy"|"compact" = "comfortable";
  @Prop() pagination: boolean = false;
  @Prop() items: number = 50;
  @Prop() expandInto: string|"row"|"side-panel"|"dialog" = "row";

  @State() columns: Array<Object>;
  @State() data: Array<Object>;

  componentWillLoad() {
    var table = this.element.querySelector('table');

    if (table) {
      this.prepareContent(table);
    }
  }

  componentDidLoad() {
    if (this.swappable) {
      const swappable = new Swappable(this.element.querySelector('.tbody'), {
        draggable: '.tr',
        handle: '.drag-handle'
      });

      swappable.on('swappable:start', () => console.log('swappable:start'))
      swappable.on('swappable:swapped', () => console.log('swappable:swapped'));
      swappable.on('swappable:stop', () => console.log('swappable:stop'));

      console.log(swappable.getDraggableElementsForContainer());
    }
  }

  @Method()
  state() {
    return {
      columns: this.columns,
      data: this.data
    }
  }

  prepareContent (table: HTMLTableElement) {
    this.gatherColumns(table);
    this.gatherData(table);
    table.remove();
  }

 gatherColumns (table: HTMLTableElement) {
    var columns = Array.prototype.map.call(table.querySelectorAll('thead tr'), (tr) => {
      return Array.prototype.map.call(tr.querySelectorAll('td,th'), (td) => {
        return this.sanitizeHeadTD(td);
      });
    });

    this.columns = columns;
  }

  gatherData (table: HTMLTableElement) {
    var data = Array.prototype.map.call(table.querySelectorAll('tbody tr'), (tr) => {
      return Array.prototype.map.call(tr.querySelectorAll('td,th'), (td) => {
        return this.sanitizeTD(td);
      });
    });

    this.data = data;
  }

  sanitizeHeadTD (element: any): CompleteTableCell {
    return {
      content: element.innerHTML,
      name: element.id,
      id: element.id
    }
  }

  sanitizeTD (element: any): CompleteTableCell {
    return {
      content: element.innerHTML,
      name: element.id,
      id: element.id
    }
  }

  // Render Methods
  renderDragTab () {
    return (
      <div class="td small">
        <button class="drag-handle"></button>
      </div>
    );
  }

  renderSelectColumn () {
    return (
      <div class="td small">
        <input type="checkbox" onChange={() => { console.log('Select one item'); }} />
      </div>
    );
  }

  renderHeaderDragTab () {
    return (
      <div class="th small"></div>
    );
  }

  renderHeaderSelectColumn () {
    return (
      <div class="th small">
        <input type="checkbox" onChange={() => { console.log('Select all'); }} />
      </div>
    );
  }

  renderTableHead () {
    return (
      <div class="thead">
        {this.columns.map((column) => {
          return this.renderTableHeadRow(column)
        })}
      </div>
    )
  }

  renderTableHeadRow (row) {
    return (
      <div class="tr">
        { this.swappable && this.renderHeaderDragTab() }
        { this.selectable && this.renderHeaderSelectColumn() }
        {row.map((row) => {
          return this.renderTableHeadColumnName(row)
        })}
      </div>
    )
  }

  renderTableHeadColumnName (item) {
    return (
     <div class="th" innerHTML={this.raw ? item.content : undefined}>
       {!this.raw ? item.content : undefined}
     </div>
    )
  }

  renderTableBody () {
    return (
      <div class="tbody">
        {this.data.map((row, index) => {
          return this.renderTableRow(row, index)
        })}
      </div>
    )
  }

  renderTableRow (row, index) {
    return (
      <div class="tr" data-index={index}>
        { this.swappable && this.renderDragTab() }
        { this.selectable && this.renderSelectColumn() }
        {row.map((row) => {
          return this.renderTableCell(row)
        })}
      </div>
    )
  }

  renderTableCell (item) {
    return (
     <div class="td" innerHTML={this.raw ? item.content : undefined}>
       {!this.raw ? item.content : undefined}
     </div>
    )
  }

  render () {
    return (
      <div class="table">
        { this.renderTableHead() }
        { this.renderTableBody() }
      </div>
    );
  }
}


interface CompleteTableCell {
  content: string;
  name: string;
  id: string;
}
