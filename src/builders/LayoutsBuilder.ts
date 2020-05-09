import { LayoutInterface } from './types';

class LayoutsBuilder {
  layoutsArr: LayoutInterface[] = [];
  layoutIdToArrIndex = new Map<string, number>();

  constructor(layouts: LayoutInterface[] = []) {
    this.layoutsArr = layouts;
    this.layoutIdToArrIndex = new Map(layouts.map((layout, index) => [layout.id, index]));
  }

  addLayout(layout: LayoutInterface) {
    this.layoutsArr = this.layoutsArr.concat([layout]);
    this.layoutIdToArrIndex.set(layout.id, this.layoutsArr.length - 1);
    return this;
  }

  removeLayout(layoutId: LayoutInterface['id']) {
    const layoutIndex = this.layoutIdToArrIndex.get(layoutId);
    if (layoutIndex == null) {
      return this;
    }
    this.layoutsArr = [...this.layoutsArr.slice(0, layoutIndex), ...this.layoutsArr.slice(layoutIndex + 1)];
    this.layoutIdToArrIndex.delete(layoutId);
    return this;
  }

  updateLayout(layout: LayoutInterface) {
    const layoutIndex = this.layoutIdToArrIndex.get(layout.id);
    if (layoutIndex == null) {
      return this;
    }
    this.layoutsArr = [...this.layoutsArr.slice(0, layoutIndex), layout, ...this.layoutsArr.slice(layoutIndex + 1)];
    return this;
  }

  build(): LayoutInterface[] {
    return this.layoutsArr;
  }
}

export { LayoutsBuilder };
