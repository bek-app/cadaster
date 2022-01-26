import { Column, Formatter } from 'angular-slickgrid';

export const parameterCalcFormatter: Formatter = (
  row: number,
  cell: number,
  value: any,
  columnDef: Column,
  dataContext: any,
  grid?: any
) => ({
  addClasses:
    !value && !dataContext.__hasChildren && !!dataContext.dicUnit.name
      ? 'border border-danger text-white'
      : '',
  text: !dataContext.__hasChildren ? value : '',
});

