import { LayoutsBuilder } from '../builders/LayoutsBuilder';
import { LayoutBuilder } from '../builders/LayoutBuilder';
import { RowBuilder } from '../builders/RowBuilder';
import { ColumnBuilder } from '../builders/ColumnBuilder';

import { getFieldIds } from './helper';

it('getFieldIds', () => {
  const layouts = new LayoutsBuilder()
    .addLayout(
      new LayoutBuilder()
        .addRow('name')
        .addRow(new RowBuilder().addColumn('email').addColumn('address').build())
        .build()
    )
    .build();
  expect(getFieldIds(layouts[0])).toEqual(['name', 'email', 'address']);
  expect(getFieldIds(new RowBuilder().addColumn('email').addColumn('address').build(), 'columns')).toEqual([
    'email',
    'address',
  ]);

  expect(
    getFieldIds(
      new RowBuilder()
        .addColumn('email')
        .addColumn('phone')
        .addColumn(new ColumnBuilder().addRow('address 1').addRow('address 2').build())
        .build(),
      'columns'
    )
  ).toEqual(['email', 'phone', 'address 1', 'address 2']);
});
