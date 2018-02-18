import { Component, Prop, State, Element, Method, Watch } from '@stencil/core';
import Sortable from '@shopify/draggable/lib/sortable';

@Component({
  tag: 'complete-table',
  styleUrl: 'complete-table.css'
})
export class CompleteTable {
  @Element() element: HTMLElement;

  @Prop() sticky: boolean;
  @Prop() raw: boolean = false;
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

  @State() __sortable: any;

  @State() columns: Array<Object> = [];
  @State() data: CompleteTableDataModel = {
    version: 0,
    list: []
  };

  componentWillLoad() {
    var table = this.element.querySelector('table');

    if (table) {
      this.prepareContent(table);
    }
  }

  componentDidLoad() {
    this.observeSortable(this.sortable);
  }

  @Watch('sortable')
  observeSortable(value: boolean) {
    if (value) {
      this.initSortable()
    } else {
      this.destroySortable()
    }
  }

  initSortable () {
    if (this.sortable) {
      this.__sortable = new Sortable(this.element.querySelector('.tbody'), {
        draggable: '.tr',
        handle: '.drag-handle'
      });

      this.__sortable.on('sortable:stop', () => { this.updateDataOnSort() });
    }
  }

  updateDataOnSort() {
    this.gatherData(this.element);
  }

  destroySortable () {
    if (!this.sortable && this.__sortable) {
      this.__sortable.destroy();
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

 gatherColumns (table: HTMLTableElement|HTMLElement) {
    var columns = Array.prototype.map.call(table.querySelectorAll('thead tr'), (tr) => {
      return Array.prototype.map.call(tr.querySelectorAll('td,th'), (td) => {
        return this.sanitizeHeadTD(td);
      });
    });

    this.columns = columns;
  }

  gatherData (table: HTMLTableElement|HTMLElement) {
    var list = Array.prototype.map.call(table.querySelectorAll('tbody tr, .tbody .tr:not(.draggable--original):not(.draggable-mirror)'), (tr) => {
      return Array.prototype.map.call(tr.querySelectorAll('td:not(.ignore),th:not(.ignore),.td:not(.ignore),.th:not(.ignore)'), (td) => {
        return this.sanitizeTD(td);
      });
    });

    this.data = {
      version: this.data.version + 1,
      list: list
    };
  }

  sanitizeHeadTD (element: any): CompleteTableCell {
    return {
      content: element.innerHTML
    }
  }

  sanitizeTD (element: any): CompleteTableCell {
    return {
      content: element.innerHTML,
      name: element.dataset.name,
      id: element.parentNode.dataset.id
    }
  }

  // Render Methods
  renderDragTab () {
    return (
      <div class="td small ignore">
        <button class="drag-handle"></button>
      </div>
    );
  }

  renderSelectColumn () {
    return (
      <div class="td small ignore">
        <input type="checkbox" onChange={() => { console.log('Select one item'); }} />
      </div>
    );
  }

  renderHeaderDragTab () {
    return (
      <div class="th small ignore"></div>
    );
  }

  renderHeaderSelectColumn () {
    return (
      <div class="th small ignore">
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
        { this.sortable && this.renderHeaderDragTab() }
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
        {this.data.list.map((row, index) => {
          return this.renderTableRow(row, index)
        })}
      </div>
    )
  }

  renderTableRow (row, index) {
    return (
      <div class="tr" data-index={index} data-version={this.data.version}>
        { this.sortable && this.renderDragTab() }
        { this.selectable && this.renderSelectColumn() }
        { row.map((item, index) => {
          return this.renderTableCell(item, index)
        }) }
      </div>
    )
  }

  renderTableCell (item, index) {
    return (
     <div class="td" data-index={index} innerHTML={this.raw ? item.content : undefined}>
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
  name?: string;
  id?: string;
}

interface CompleteTableDataModel {
  version: number;
  list: Array<Array<Object>>;
}
