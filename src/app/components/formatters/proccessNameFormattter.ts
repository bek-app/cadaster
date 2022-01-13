import { Column, Formatter } from 'angular-slickgrid';

export const proccessNameFormatter: Formatter = (
  row: number,
  cell: number,
  value: any,
  columnDef: Column,
  dataContext: any,
  grid?: any
) => {
  if (dataContext.dicPollutantId && value === null) {
    return `<div class="d-flex justify-content-between"> ...<i class="bi bi-pen"> </i>  </div>`;
  } else if (dataContext.dicPollutantId) {
    return `<div class="d-flex justify-content-between"> <i>${value}</i> <i class="bi bi-pen"> </i>  </div>`;
  } else if (dataContext.dicMaterialId) {
    return { addClasses: 'bg-secondary bg-opacity-50', text: '' };
  } else return { addClasses: '', text: '' };
};
