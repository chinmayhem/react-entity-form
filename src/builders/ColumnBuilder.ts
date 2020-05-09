import { ColumnObjectInterface, RowInterface } from './types';

function makeIdGenerator() {
  let id = 1;
  return function generateId() {
    return `${id++}`;
  };
}

const idGenerator = makeIdGenerator();

class ColumnBuilder {
  rows: RowInterface[] = [];
  id = idGenerator();
  isHidden = false;
  additional = undefined;

  constructor(column?: ColumnObjectInterface) {
    if (column) {
      this.rows = column.rows;
      this.id = column.id;
      this.isHidden = column.isHidden;
      this.additional = column.additional;
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

  setAdditional(additional) {
    this.additional = additional;
    return this;
  }

  addRow(row: RowInterface) {
    this.rows = this.rows.concat([row]);
    return this;
  }

  build(): ColumnObjectInterface {
    return {
      id: this.id,
      rows: this.rows,
      isHidden: this.isHidden,
      additional: this.additional,
    };
  }
}

export { ColumnBuilder };
