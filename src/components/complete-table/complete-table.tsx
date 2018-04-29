import { Component, Prop, State, Element, Method, Watch } from '@stencil/core';
import Dexie from 'dexie';
import merge from 'deepmerge';
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
   * Holds the selected state.
   * @private
   * @type {[type]}
   */
  @State() __selected: Array<number> = [];

  /**
   * Renders and stores the name of the table
   * @type {string}
   */
  @State() __name: string = "complete_table";

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
   * holds the current page of items to render
   * @private
   * @type {Array}
   */
  @State() __currentPageItems: Array<Object> = undefined;

  /**
   * Holds the current page number
   * @private
   * @type {number}
   */
  @State() __currentPage: number;

  /**
   * Holds the count of pages for the items property divided by total items in the array
   * @private
   * @type {[type]}
   */
  @State() __pageCount: number;

  /**
   * Holds the current pages
   * @private
   * @type {[type]}
   */
  @State() __pageArray: Array<number>;

  /**
   * Renders the history HTML and prepares the history behavior
   * @type {boolean}
   */
  @Prop() history: boolean = false;

  /**
   * Holds the reference to indexed db
   * @type {boolean}
   */
  @State() __history: any;

  /**
   * Holds the reference to indexed db
   * @type {boolean}
   */
  @State() __latestVersion: number = 1;

  /**
   * Renders the editable HTML and prepares the editable behavior
   * @type {boolean}
   */
  @Prop() name: string = "table";

  /**
   * Renders the editable HTML and prepares the editable behavior
   * @type {boolean}
   */
  @Prop() editable: boolean = false;

  /**
   * Renders the filterable HTML and prepares the filterable behavior
   * @type {[type]}
   */
  @Prop() filterable: boolean = false;
  @Prop() searchable: boolean = false;
  @Prop() expandable: boolean = false;
  @Prop() expandInto: string|"row"|"side-panel"|"dialog" = "row";

  @State() __sortable: any;
  @State() __resizable: any;
  @State() __resizableState: any;

  @State() columns: Array<Object> = [];
  @State() data: { version: number; list: Array<Array<Object>>; selected: Array<number>; } = {
    version: 0,
    list: [],
    selected: []
  };

  componentWillLoad() {
    var table = this.element.querySelector('table');

    if (table) {
      this.prepareContent(table);
    }
  }

  componentDidLoad() {
    this.observeHistory(this.history);
    this.observeSortable(this.sortable);
    this.observeResizeable(this.resizable);
    this.observePagination(this.pagination);
  }



  /**
   * Sortable
   */
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

      this.__sortable.on('sortable:stop', () => { this.updateDataOnSort(); });
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

  /**
   * Resizable
   */
  @Watch('resizable')
  observeResizeable(value: boolean) {
    if (value) {
      this.initResizable()
    } else {
      this.destroyResizable()
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
    console.log(newState);
  }

  destroyResizable () {
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
    const low = (this.__currentPage) * this.items;
    const high = (((this.__currentPage + 1) * this.items));
    this.__currentPageItems = this.data.list.slice(low, high);
  }

  updateCurrentPage(select: EventTarget) {
    // @ts-ignore
    this.__currentPage = parseInt(select.value);
    this.preparePages();
  }



  /**
   * Editable
   */
  @Watch('editable')
  observeEditable(value: boolean) {
    if (value) {
      this.initEditable()
    } else {
      this.destroyEditable()
    }
  }

  initEditable () {

  }

  destroyEditable () {

  }


  /**
   * History
   */
  @Watch('history')
  observeHistory(value: boolean) {
    if (value) {
      this.initHistory()
    } else {
      this.destroyHistory()
    }
  }

  initHistory () {
    this.__history = new Dexie(this.__name);
    this.__history.version(1).stores({
      history: 'version'
    });

    this.__history.open().catch(function(error) {
      alert('Uh oh : ' + error);
    });

    this.__history.history.clear();

    this.__history.history.add(this.data);
  }

  destroyHistory () {

  }

  async applyVersion (version: any) {
    const state = await this.__history.history
      .where({ 'version': parseInt(version) }).first();

   this.updateData(state);
  }

  @Method()
  state() {
    return {
      columns: this.columns,
      data: this.data,
      selected: this.__selected
    }
  }

  @Method()
  updateData(data: any) {
    // @ts-ignore
    function overwriteMerge(destinationArray, sourceArray, options) {
        return sourceArray
    }

    this.data = {...merge(this.data, data, { arrayMerge: overwriteMerge })};

    this.verifyRender(this.data.list);

    this.__selected = this.data.selected;

    if (this.history && this.__history) {
      this.__history.history.put(this.data);
      this.__history.history.orderBy('version').last().then((lv) => {
        this.__latestVersion = lv.version;
      });
    }
  }

  verifyRender(state) {
    Array.prototype.map.call(this.element.querySelectorAll('.tbody .tr'), (rowEl, rowIndex) => {
      Array.prototype.map.call(rowEl.querySelectorAll('.td:not(.ignore)'), (colEl, columnIndex) => {
          if (colEl.innerHTML !== state[rowIndex][columnIndex].content) {
            colEl.innerHTML = state[rowIndex][columnIndex].content;
          }
      });
    });
  }

  @Method()
  undo() {
    this.applyVersion(this.data.version - 1);
  }

  @Method()
  redo() {
    this.applyVersion(this.data.version + 1);
  }

  handleVersionChange(e) {
    const version = e.target.value;
    this.applyVersion(version);
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

  async gatherData (table: HTMLTableElement|HTMLElement) {
    var list = Array.prototype.map.call(table.querySelectorAll('tbody tr, .tbody .tr:not(.draggable--original):not(.draggable-mirror)'), (tr) => {
      console.log(tr);
      return Array.prototype.map.call(tr.querySelectorAll('td:not(.ignore),th:not(.ignore),.td:not(.ignore),.th:not(.ignore)'), (td) => {
        return this.sanitizeTD(td);
      });
    });

    this.updateData({
      version: this.data.version + 1,
      list: list,
      selected: this.__selected
    });
  }

  sanitizeHeadTD (element: any): { content: string; name?: string; id?: string; selected?: boolean; } {
    return {
      content: element.innerHTML
    }
  }

  sanitizeTD (element: any): { content: string; name?: string; id?: string; selected?: boolean; } {
    return {
      content: element.innerHTML,
      id: element.parentNode.dataset.id,
    }
  }

  valueSelected (value) {
    if (value) {
      // @ts-ignore
      return this.__selected.includes(value.toString());
    }
  }

  createEditableItem (row, column, value) {
    const input = document.createElement('input');
    input.value = value;
    input.autofocus = true;
    input.onblur = (e) => {
      const updates = this.data.list;

      // @ts-ignore
      updates[row][column].content = e.target.value;

      this.updateData({
        version: this.data.version + 1,
        list: updates,
        selected: this.__selected
      });

      this.updateData({
        version: this.data.version,
        list: updates,
        selected: this.__selected
      });
    }

    return input;
  }

  handleCellDoubleClick (e, value) {
    if (this.editable) {
      const item = e.target;
      const row = parseInt(item.dataset.row);
      const column = parseInt(item.dataset.column);

      e.target.innerHTML = "";

      item.appendChild(this.createEditableItem(row, column, value));
      item.classList.add('editing');
    }
  }

  handleSelectOne(e, row_id) {
    let updated = [];

    if (e.target.checked) {
      updated.push(row_id);
      this.__selected = Array.from(new Set([...updated, ...this.__selected]));
      e.target.parentNode.parentNode.classList.add('selected');
    } else {
      this.__selected = this.__selected.filter(item => item !== row_id);
      e.target.parentNode.parentNode.classList.remove('selected');
    }

    this.updateData({
      version: this.data.version + 1,
      list: this.data.list,
      selected: this.__selected
    });
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
        <button class="drag-handle">☰</button>
      </div>
    );
  }

  renderSelectColumn (row: { content: string; name?: string; id?: string; selected?: boolean; }) {
    return (
      <div class="td small ignore"><input type="checkbox" class="single" value={row[0].id} checked={this.valueSelected(row[0].id)} onChange={(e) => { this.handleSelectOne(e, row[0].id) }} /></div>
    );
  }

  renderHeaderDragTab () {
    return (
      <div class="th small ignore"></div>
    );
  }

  renderHeaderHistoryColumn () {
    return (
      <div class="th">
        <input type="number" readonly value={this.data.version} onChange={ (e) => { this.handleVersionChange(e); } } />
        <button onClick={() => {this.undo()}} disabled={(this.data.version <= 1)}>undo</button>
        <button onClick={() => {this.redo()}} disabled={(this.data.version >= this.__latestVersion && this.data.version === this.__latestVersion)}>redo</button>
      </div>
    );
  }

  renderHeaderSelectColumn () {
    if (this.pagination) {
      return (
        <div class="th small ignore"></div>
      );
    } else {
      // @ts-ignore
      return (<div class="th small ignore"><input type="checkbox" class="all" indeterminate={this.__selected.length !== this.data.list.length && this.__selected.length !== 0} checked={this.__selected.length === this.data.list.length} onChange={(e) => { this.handleSelectAll(e) }} /></div>);
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
        { this.pagination && this.__currentPageItems && this.__currentPageItems.map((row, rowIndex) => {
          return this.renderTableRow(row, rowIndex)
        })}
        { !this.pagination && this.data.list.map((row, rowIndex) => {
          return this.renderTableRow(row, rowIndex)
        })}
      </div>
    )
  }

  renderTableRow (row, rowIndex) {
    const selected = (this.valueSelected(row[0].id)) ? 'selected' : '';

    return (
      <div class={`tr ${selected}`} data-id={row[0].id} data-row={rowIndex} data-version={this.data.version}>
        { this.sortable && this.renderDragTab() }
        { this.selectable && this.renderSelectColumn(row) }
        { row.map((item, columnIndex) => {
          return this.renderTableCell(item, columnIndex, rowIndex)
        }) }
      </div>
    )
  }

  renderTableCell (item, columnIndex, rowIndex) {
    return (
     <div class="td" data-column={columnIndex} data-row={rowIndex} innerHTML={item.content} data-value={item.content} onDblClick={(e) => { this.handleCellDoubleClick(e, item.content); }}></div>
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

  renderTable() {
    return (
      <table id={this.name}>
        <thead>
          <tr>
            { this.columns.map((cols: Array<any>) => {
              return cols.map((cell) => {
                return (<th>{cell.content}</th>)
              })
            }) }
          </tr>
        </thead>
        <tbody>
          { this.data.list.map((cols: Array<any>) => {
            return <tr>{ cols.map((cell) => {
              return (<td>{cell.content}</td>)
            }) }</tr>
          }) }
        </tbody>
      </table>
    )
  }

  render () {
    return [
      // @ts-ignore
      <div class="table" name={this.__name} tabindex="0">
        <div class="tr options">
          { this.pagination && this.renderPageSelect() }
          { this.pagination && this.renderPageSelectNumber() }
          { this.history && this.renderHeaderHistoryColumn() }
        </div>

        { this.renderTableHead() }
        { this.renderTableBody() }
        { this.selectable && this.renderSelectedItems() }
      </div>,
      this.renderTable()
    ];
  }
}
