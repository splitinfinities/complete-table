import { Component, Prop, State, Element, Method, Watch } from '@stencil/core';
import Sortable from '@shopify/draggable/lib/sortable';
import Draggable from '@shopify/draggable/lib/draggable';
// import { Drag } from './helpers';

@Component({
  tag: 'complete-table',
  styleUrl: 'complete-table.css'
})
export class CompleteTable {
  /**
   * The instance of the Element
   * @type {HTMLElement}
   */
  @Element() element: HTMLElement;

  /**
   * Responsible for making the .thead sticky.
   * @type {boolean}
   */
  @Prop() sticky: boolean;

  /**
   * Renders HTML in the table
   * @type {boolean}
   */
  @Prop() raw: boolean = false;

  /**
   * Renders the sortable HTML and prepares sortable behavior
   * @type {boolean}
   */
  @Prop() sortable: boolean = false;

  /**
   * Renders the selectable HTML and prepared the selectable behavior
   * @type {boolean}
   */
  @Prop() selectable: boolean = false;

  /**
   * PRIVATE: Holds the selected state.
   * @private
   * @type {[type]}
   */
  @State() __selected: Array<number> = [];

  /**
   * Renders and stores the name of the table
   * @type {string}
   */
  @State() __name: string;

  /**
   * Renders the readability HTML and prepares the readability behavior
   * @type {string}
   */
  @Prop() readability: string|"border"|"even"|"odd" = undefined;

  /**
   * Renders the density HTML and prepares the density behavior
   * @type {string}
   */
  @Prop() density: string|"comfortable"|"cozy"|"compact" = "comfortable";

  /**
   * Renders the resizable HTML and prepares the resizable behavior
   * @type {boolean}
   */
  @Prop() resizable: boolean = false;

  /**
   * Renders the pagination HTML and prepares the pagination behavior
   * @type {boolean}
   */
  @Prop() pagination: boolean = false;

  /**
   * Controls how many items are in the pagination
   * @default 10
   * @type {number}
   */
  @Prop() items: number = 10;

  /**
   * PRIVATE: holds the current page of items to render
   * @type {Array}
   */
  @State() __currentPageItems: Array<Object> = undefined;

  /**
   * PRIVATE: Holds the current page number
   * @type {number}
   */
  @State() __currentPage: number;

  /**
   * PRIVATE: holds the count of pages for the items property divided by total items in the array
   * @type {[type]}
   */
  @State() __pageCount: number;

  /**
   * PRIVATE: Holds the current pages
   * @type {[type]}
   */
  @State() __pageArray: Array<number>;

  /**
   * Renders the filterable HTML and prepares the filterable behavior
   * @type {[type]}
   */
  @Prop() filterable: boolean = false;
  @Prop() searchable: boolean = false;
  @Prop() editable: boolean = false;
  @Prop() expandable: boolean = false;
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
    this.observePagination(this.pagination);
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


  /**
   * Pagination
   */
  @Watch('pagination')
  observePagination(value: boolean) {
    if (value) {
      this.initPagination()
    } else {
      this.destroyPagination()
    }
  }

  initPagination () {
    this.__currentPage = 0;
    this.__pageCount = Math.ceil(this.data.list.length / this.items);
    this.__pageArray = Array.from(Array(this.__pageCount).keys());
    this.preparePages();
  }

  destroyPagination () {
    this.__currentPage = undefined;
    this.__pageCount = undefined;
    this.__pageArray = undefined;
    this.__currentPageItems = undefined;
  }

  preparePages() {
    const low = (this.__currentPage - 1) * this.items;
    const high = ((this.__currentPage * this.items) - 1);
    this.__currentPageItems = this.data.list.slice(low, high);
  }

  updateCurrentPage(select: EventTarget) {
    // @ts-ignore
    this.__currentPage = parseInt(select.value);
    this.preparePages();
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
    this.__name = this.element.querySelector('table').getAttribute('name');
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
      id: element.parentNode.dataset.id,
    }
  }

  valueSelected (value) {
    // @ts-ignore
    return this.__selected.includes(value.toString())
  }

  handleSelectOne(e) {
    let updated = [];

    if (e.target.checked) {
      updated.push(e.target.value);
      this.__selected = [...updated, ...this.__selected];
      e.target.parentNode.parentNode.classList.add('selected');
    } else {
      this.__selected = this.__selected.filter(item => item !== e.target.value);
      e.target.parentNode.parentNode.classList.remove('selected');
    }
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

  renderSelectColumn (row: CompleteTableCell) {
    return (
      // @ts-ignore
      <div class="td small ignore"><input type="checkbox" class="single" value={row[0].id} checked={this.valueSelected(row[0].id)} onChange={(e) => { this.handleSelectOne(e) }} /></div>
    );
  }

  renderHeaderDragTab () {
    return (
      <div class="th small ignore"></div>
    );
  }

  renderHeaderSelectColumn () {
    if (this.pagination) {
      return (
        // @ts-ignore
        <div class="th small ignore"></div>
      );
    } else {
      return (
        // @ts-ignore
        <div class="th small ignore"><input type="checkbox" class="all" indeterminate={this.__selected.length !== this.data.list.length && this.__selected.length !== 0} onChange={(e) => { this.handleSelectAll(e) }} /></div>
      );
    }
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
        { this.pagination && this.__currentPageItems && this.__currentPageItems.map((row, index) => {
          return this.renderTableRow(row, index)
        })}
        { !this.pagination && this.data.list.map((row, index) => {
          return this.renderTableRow(row, index)
        })}
      </div>
    )
  }

  renderTableRow (row, index) {
    const selected = (this.valueSelected(row[0].id)) ? 'selected' : '';

    return (
      <div class={`tr ${selected}`} data-index={index} data-version={this.data.version}>
        { this.sortable && this.renderDragTab() }
        { this.selectable && this.renderSelectColumn(row) }
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

  renderPageSelect () {
    return (
        <div class="td">
          <select onChange={(e) => { this.updateCurrentPage(e.target); }}>
            {this.__pageArray && this.__pageArray.map((item) => {
              return <option selected={this.__currentPage === item} value={item}>{item + 1}</option>
            }) }
          </select>
        </div>
    )
  }

  renderPageSelectNumber () {
    return (
      <div>
        <p>{this.__selected.length} of {this.data.list.length} selected</p>
      </div>
    )
  }

  renderSelectedItems () {
    return this.__selected.map((value) => {
      return <input type="hidden" name={this.__name} value={value} checked={true} />
    });
  }

  render () {
    return (
      // @ts-ignore
      <div class="table" name={this.__name}>
        <div class="tr options">
          { this.pagination && this.renderPageSelect() }
          { this.pagination && this.renderPageSelectNumber() }
        </div>

        { this.renderTableHead() }
        { this.renderTableBody() }
        { this.selectable && this.renderSelectedItems() }
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
