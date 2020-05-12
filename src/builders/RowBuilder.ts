import { RowObjectInterface, ColumnInterface } from './types';

function makeIdGenerator() {
  let id = 1;
  return function generateId() {
    return `${id++}`;
  };
}

const idGenerator = makeIdGenerator();

class RowBuilder {
  columns: ColumnInterface[] = [];
  id = idGenerator();
  isHidden = false;
  additional: any = undefined;

  constructor(row?: RowObjectInterface) {
    if (row) {
      this.columns = row.columns;
      this.id = row.id;
      this.isHidden = row.isHidden;
      this.additional = row.additional;
    }
    return this;
  }

  markHidden() {
    this.isHidden = true;
    return this;
  }

  markVisible() {
    this.isHidden = false;
    return this;
  }

  setAdditional(additional: any) {
    this.additional = additional;
    return this;
  }

  addColumn(column: ColumnInterface) {
    this.columns = this.columns.concat([column]);
    return this;
  }

  build(): RowObjectInterface {
    return {
      id: this.id,
      columns: this.columns,
      isHidden: this.isHidden,
      additional: this.additional,
    };
  }
}

export { RowBuilder };
