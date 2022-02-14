import { Formatter, GridOption } from 'angular-slickgrid'
export const reportCadasterTreeFormatter: Formatter = (
  _row,
  _cell,
  value,
  _columnDef,
  dataContext,
  grid,
) => {
  const gridOptions = grid.getOptions() as GridOption
  const treeLevelPropName =
    (gridOptions.treeDataOptions &&
      gridOptions.treeDataOptions.levelPropName) ||
    '__treeLevel'
  if (value === null || value === undefined || dataContext === undefined) {
    return ''
  }

  const dataView = grid.getData()
  const data = dataView.getItems()
  const identifierPropName = dataView.getIdPropertyName() || 'id'
  const idx = dataView.getIdxById(dataContext[identifierPropName]) as number

  value = value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
  const spacer = `<span style="display:inline-block; width:${
    15 * dataContext[treeLevelPropName]
  }px;"></span>`

  if (
    data[idx + 1] &&
    data[idx + 1][treeLevelPropName] > data[idx][treeLevelPropName] &&
    dataContext.__treeLevel === 0
  ) {
    const folderPrefix = `<span class="mdi icon color-alt-warning ${
      dataContext.__collapsed ? 'mdi-folder' : 'mdi-folder-open'
    }">
    </span>`

    if (dataContext.__collapsed) {
      return `${spacer} <span class="slick-group-toggle collapsed" level="${dataContext[treeLevelPropName]}"> </span>${folderPrefix}
       <strong style="font-weight:bold; font-size:18px; "> ${value}</strong>`
    } else {
      return `${spacer} <span class="slick-group-toggle expanded" level="${dataContext[treeLevelPropName]}"></span>  ${folderPrefix}
      <strong style="font-weight:bold; font-size:18px;   "> ${value}</strong>`
    }
  } else if (
    data[idx + 1] &&
    data[idx + 1][treeLevelPropName] > data[idx][treeLevelPropName] &&
    dataContext.__treeLevel === 1
  ) {
    const folderPrefix = `<span   class="mdi color-muted-light ${
      dataContext.__collapsed ? 'mdi-folder' : 'mdi-folder-open'
    }"></span>`

    if (dataContext.__collapsed) {
      return `${spacer} <span class="slick-group-toggle collapsed" level="${dataContext[treeLevelPropName]}"></span>  ${folderPrefix}&nbsp;
       <strong style="font-weight:bold; font-size:16px; color: #7B848D;"> ${value}</strong>`
    } else {
      return `${spacer} <span class="slick-group-toggle expanded" level="${dataContext[treeLevelPropName]}"></span>${folderPrefix}&nbsp;
       <strong style="font-weight:bold; font-size:16px; color: #7B848D;"> ${value}</strong>`
    }
  } else if (dataContext.__treeLevel === 1) {
    return `${spacer} <span  class="slick-group-toggle collapsed> </span> <span  class="mdi  mdi-folder></span>
    <strong style="font-weight:bold; font-size:16px; color: #7B848D;"> ${value}</strong>`
  } else {
    return `${spacer} <span class="slick-group-toggle " level="${dataContext[treeLevelPropName]}"></span> &nbsp;${value}`
  }
}
