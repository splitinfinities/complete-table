import { Component, Prop, State, Element, Method, Watch } from '@stencil/core';
import Sortable from '@shopify/draggable/lib/sortable';
import Draggable from '@shopify/draggable/lib/draggable';
// import { Drag } from './helpers';

@Component({
  tag: 'complete-table',
  styleUrl: 'complete-table.css'
})
export class CompleteTable {
  @Element() element: HTMLElement;

  // Done
  @Prop() sticky: boolean;

  // Done
  @Prop() raw: boolean = false;

  // Done
  @Prop() sortable: boolean = false;

// In progress
  @Prop() selectable: boolean = false;

  // In progress
  @Prop() resizable: boolean = false;


  @Prop() filterable: boolean = false;
  @Prop() searchable: boolean = false;
  @Prop() editable: boolean = false;
  @Prop() expandable: boolean = false;
  @Prop() readability: string|"border"|"even"|"odd" = undefined;
  @Prop() density: string|"comfortable"|"cozy"|"compact" = "comfortable";
  @Prop() pagination: boolean = false;
  @Prop() items: number = 50;
  @Prop() expandInto: string|"row"|"side-panel"|"dialog" = "row";

  @State() __sortable: any;
  @State() __resizable: any;
  @State() __resizableState: any;

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
    this.observeResizeable(this.resizable);
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

  destroySortable () {
    if (!this.sortable && this.__sortable) {
      this.__sortable.destroy();
    }
  }

  updateDataOnSort() {
    this.gatherData(this.element);
  }

  @Watch('resizable')
  observeResizeable(value: boolean) {
    if (value) {
      this.initResizable()
    } else {
      this.destroySizable()
    }
  }

  initResizable () {
    if (this.resizable) {
      this.__resizable = new Draggable(this.element.querySelector('.thead'), {
        draggable: '.th',
        handle: '.resize-handle',
        classes: {
          'body:dragging': 'resizable--is-dragging',
          'container:dragging': 'resizable-container--is-dragging',
          'source:dragging': 'resizable-source--is-dragging',
          'source:placed': 'resizable-source--placed',
          'container:placed': 'resizable-container--placed',
          'draggable:over': 'resizable--over',
          'container:over': 'resizable-container--over',
          'source:original': 'resizable--original',
          'mirror': 'resizable-mirror',
        }
      });

      this.__resizable.on('drag:start', (e) => { this.setResizableState(e) });
      this.__resizable.on('drag:move', (e) => { this.updateColumnWidth(e) });
      this.__resizable.off('mirror:move');
    }
  }

  pullResizableState(event) {
    return {
      columnWidth: event.originalEvent.target.parentNode.offsetWidth,
      handleWidth: event.originalEvent.target.offsetWidth,
      position: event.originalEvent.pageX
    }
  }

  setResizableState(event) {
    this.__resizableState = this.pullResizableState(event);
  }

  updateColumnWidth(event) {
    const newState = this.pullResizableState(event);
    console.log(this.__resizableState, newState);
  }

  destroySizable () {
    if (!this.resizable && this.__resizable) {
      this.__resizable.destroy();
    }
  }

  @Method()
  state() {
    return {
      columns: this.columns,
      data: this.data
    }
  }

  @Method()
  updateData(data: any) {
    this.data.version = data.version;
    this.data.list = [...data.list];
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

    this.updateData({
      version: this.data.version + 1,
      list: list
    });
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
      id: element.parentNode.dataset.id,
    }
  }

  handleSelectOne(e) {
    console.log(e.target.checked);
  }

  handleSelectAll(e) {
    var event = new Event('change');
    var inputs = this.element.querySelectorAll('input[type="checkbox"].single');
    Array.prototype.forEach.call(inputs, (input) => {
      input.checked = e.target.checked;
      input.dispatchEvent(event);
    });
  }



  // Render Methods
  renderDragTab () {
    return (
      <div class="td small ignore">
        <button class="drag-handle"></button>
      </div>
    );
  }

  renderSelectColumn (index: number) {
    return (
      <div class="td small ignore">
        <input type="checkbox" class="single" value={index} onChange={(e) => { this.handleSelectOne(e) }} />
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
        <input type="checkbox" class="all" onChange={(e) => { this.handleSelectAll(e) }} />
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
        { row.map((row) => {
          return this.renderTableHeadColumnName(row)
        }) }
      </div>
    )
  }

  renderTableHeadColumnName (item) {
    return (
     <div class="th">
       { this.resizable && <button class="resize-handle"></button> }
       <span>{ item.content }</span>
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
        { this.selectable && this.renderSelectColumn(index) }
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
  selected?: boolean;
}

interface CompleteTableDataModel {
  version: number;
  list: Array<Array<Object>>;
}
