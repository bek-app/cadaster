import { Column, Formatter } from 'angular-slickgrid';

export const parameterCalcFormatter: Formatter = (
  row: number,
  cell: number,
  value: any,
  columnDef: Column,
  dataContext: any,
  grid?: any
) => {
  const { id, __hasChildren, dicUnit } = dataContext;
  return {
    addClasses:
      !value && !__hasChildren && !!dicUnit.name ? 'border border-danger' : '',
    text: !__hasChildren ? value : '',
  };
};

 