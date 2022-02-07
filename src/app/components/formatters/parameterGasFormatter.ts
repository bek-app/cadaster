import { Column, Formatter } from 'angular-slickgrid';

export const gasCh4Formatter: Formatter = (
  row: number,
  cell: number,
  value: any,
  columnDef: Column,
  dataContext: any,
  grid?: any
) => ({
  addClasses:
    !value && !dataContext.__hasChildren && !!dataContext.gasCh4Unit.name
      ? 'border border-danger text-white'
      : '',
  text: !dataContext.__hasChildren ? value : '',
});

export const gasN2OFormatter: Formatter = (
  row: number,
  cell: number,
  value: any,
  columnDef: Column,
  dataContext: any,
  grid?: any
) => ({
  addClasses:
    !value && !dataContext.__hasChildren && !!dataContext.gasN2OUnit.name
      ? 'border border-danger text-white'
      : '',
  text: !dataContext.__hasChildren ? value : '',
});
