import { RowInterface, LayoutInterface } from '../types';

function makeIdGenerator() {
  let id = 1;
  return function generateId() {
    return `${id++}`;
  };
}

const idGenerator = makeIdGenerator();

class LayoutBuilder {
  rows: RowInterface[] = [];
  id = idGenerator();
  isHidden = false;
  additional: any = undefined;

  constructor(layout?: LayoutInterface) {
    if (layout) {
      this.rows = layout.rows;
      this.id = layout.id;
      this.isHidden = layout.isHidden;
      this.additional = layout.additional;
    }
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

  addRow(row: RowInterface) {
    this.rows = this.rows.concat([row]);
    return this;
  }

  build(): LayoutInterface {
    return {
      rows: this.rows,
      id: this.id,
      isHidden: this.isHidden,
      additional: this.additional,
    };
  }
}

export { LayoutBuilder };
