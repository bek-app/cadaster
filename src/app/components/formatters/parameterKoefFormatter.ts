import { Column, Formatter } from 'angular-slickgrid';

export const koefVolumeFormatter: Formatter = (
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

export const koefOperatingWeightFormatter: Formatter = (
  row: number,
  cell: number,
  value: any,
  columnDef: Column,
  dataContext: any,
  grid?: any
) => ({
  addClasses:
    !value &&
    !dataContext.__hasChildren &&
    !!dataContext.koefOperatingWeightUnit.name
      ? 'border border-danger text-white'
      : '',
  text: !dataContext.__hasChildren ? value : '',
});

export const koefLowerCalorificFormatter: Formatter = (
  row: number,
  cell: number,
  value: any,
  columnDef: Column,
  dataContext: any,
  grid?: any
) => ({
  addClasses:
    !value &&
    !dataContext.__hasChildren &&
    !!dataContext.koefLowerCalorificUnit.name
      ? 'border border-danger text-white'
      : '',
  text: !dataContext.__hasChildren ? value : '',
});

// Коэффициент окисления

export const koefCaseBurningFormatter: Formatter = (
  row: number,
  cell: number,
  value: any,
  columnDef: Column,
  dataContext: any,
  grid?: any
) => ({
  addClasses:
    !value &&
    !dataContext.__hasChildren &&
    !!dataContext.koefCaseBurningUnit.name
      ? 'border border-danger text-white'
      : '',
  text: !dataContext.__hasChildren ? value : '',
});
// Двуокись углерода (СО2)
export const koefCo2Formatter: Formatter = (
  row: number,
  cell: number,
  value: any,
  columnDef: Column,
  dataContext: any,
  grid?: any
) => ({
  addClasses:
    !value &&
    !dataContext.__hasChildren &&
    !!dataContext.koefCo2Unit.name
      ? 'border border-danger text-white'
      : '',
  text: !dataContext.__hasChildren ? value : '',
});

  // Метан (СН4)
  export const koefCh4Formatter: Formatter = (
    row: number,
    cell: number,
    value: any,
    columnDef: Column,
    dataContext: any,
    grid?: any
  ) => ({
    addClasses:
      !value &&
      !dataContext.__hasChildren &&
      !!dataContext.koefCh4Unit.name
        ? 'border border-danger text-white'
        : '',
    text: !dataContext.__hasChildren ? value : '',
  });
  // Закиси азота (N2O)
  export const koefN2OFormatter: Formatter = (
    row: number,
    cell: number,
    value: any,
    columnDef: Column,
    dataContext: any,
    grid?: any
  ) => ({
    addClasses:
      !value &&
      !dataContext.__hasChildren &&
      !!dataContext.koefN2OUnit.name
        ? 'border border-danger text-white'
        : '',
    text: !dataContext.__hasChildren ? value : '',
  });
 // Перфторуглероды

 export const koefPerfluorocarbonsFormatter: Formatter = (
  row: number,
  cell: number,
  value: any,
  columnDef: Column,
  dataContext: any,
  grid?: any
) => ({
  addClasses:
    !value &&
    !dataContext.__hasChildren &&
    !!dataContext.koefPerfluorocarbonsUnit.name
      ? 'border border-danger text-white'
      : '',
  text: !dataContext.__hasChildren ? value : '',
});
