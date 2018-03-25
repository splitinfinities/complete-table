declare interface CompleteTableCell {
  content: string;
  name?: string;
  id?: string;
  selected?: boolean;
}

declare interface CompleteTableDataModel {
  version: number;
  list: Array<Array<Object>>;
  selected: Array<number>;
}
