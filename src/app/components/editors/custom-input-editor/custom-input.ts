import { ComponentRef } from '@angular/core';
import { Subscription } from 'rxjs';
import {
  AngularUtilService,
  Column,
  ColumnEditor,
  Editor,
  EditorValidator,
  EditorValidationResult,
  GridOption,
  SlickGrid,
  unsubscribeAllObservables,
} from 'angular-slickgrid';

/*
 * An example of a 'detached' editor.
 * KeyDown events are also handled to provide handling for Tab, Shift-Tab, Esc and Ctrl-Enter.
 */
export class CustomInputEditor implements Editor {
  private _subscriptions: Subscription[] = [];

  /** Angular Component Reference */
  componentRef!: ComponentRef<any>;

  /** default item Id */

  /** default item object */
  defaultItem: any;

  /** SlickGrid grid object */
  grid: SlickGrid;

  constructor(private args: any) {
    this.grid = args && args.grid;
    this.init();
  }

  /** Angular Util Service (could be inside the Grid Options Params or the Editor Params ) */
  get angularUtilService(): AngularUtilService {
    let angularUtilService =
      this.gridOptions &&
      this.gridOptions.params &&
      this.gridOptions.params.angularUtilService;
    if (
      !angularUtilService ||
      !(angularUtilService instanceof AngularUtilService)
    ) {
      angularUtilService =
        this.columnEditor &&
        this.columnEditor.params &&
        this.columnEditor.params.angularUtilService;
    }
    return angularUtilService;
  }

  /** Get Column Definition object */
  get columnDef(): Column {
    return (this.args && this.args.column) || {};
  }

  /** Get Column Editor object */
  get columnEditor(): ColumnEditor {
    return (this.columnDef && this.columnDef.internalColumnEditor) || {};
  }

  /** Getter for the Grid Options pulled through the Grid Object */
  get gridOptions(): GridOption {
    return this.grid?.getOptions?.() as GridOption;
  }

  get hasAutoCommitEdit(): boolean {
    return this.gridOptions.autoCommitEdit ?? false;
  }

  /** Get the Validator function, can be passed in Editor property or Column Definition */
  get validator(): EditorValidator | undefined {
    return this.columnEditor.validator || this.columnDef.validator;
  }

  init() {
    if (this.columnEditor && this.columnEditor.params.component) {
      const componentOutput =
        this.angularUtilService.createAngularComponentAppendToDom(
          this.columnEditor.params.component,
          this.args.container
        );
      this.componentRef = componentOutput && componentOutput.componentRef;

      // when our model (item object) changes, we'll call a save of the slickgrid editor
      this._subscriptions.push(
        this.componentRef.instance.onItemChanged.subscribe((item: any) =>
          this.save()
        )
      );
    }

    if (this.hasAutoCommitEdit) {
      this.focus();
    }
  }

  save() {
    const validation = this.validate();
    if (validation && validation.valid) {
      if (this.hasAutoCommitEdit) {
        this.args.grid.getEditorLock().commitCurrentEdit();
      } else {
        this.args.commitChanges();
      }
    }
  }

  cancel() {
    this.componentRef.instance.selectedItem = this.defaultItem;
    if (this.args && this.args.cancelChanges) {
      this.args.cancelChanges();
    }
  }

  /** optional, implement a hide method on your Angular Component */
  hide() {
    if (
      this.componentRef &&
      this.componentRef.instance &&
      typeof this.componentRef.instance.hide === 'function'
    ) {
      this.componentRef.instance.hide();
    }
  }

  /** optional, implement a show method on your Angular Component */
  show() {
    if (
      this.componentRef &&
      this.componentRef.instance &&
      typeof this.componentRef.instance.show === 'function'
    ) {
      this.componentRef.instance.show();
    }
  }

  /** destroy the Angular Component & Subscription */
  destroy() {
    if (this.componentRef && this.componentRef.destroy) {
      this.componentRef.destroy();
    }

    // also unsubscribe all Angular Subscriptions
    // this._subscriptions = unsubscribeAllObservables(this._subscriptions);
  }

  /** optional, implement a focus method on your Angular Component */
  focus() {
    if (
      this.componentRef &&
      this.componentRef.instance &&
      typeof this.componentRef.instance.focus === 'function'
    ) {
      this.componentRef.instance.focus();
    }
  }

  applyValue(item: any, state: any) {
    item[this.columnDef.field] = state;
  }

  getValue() {
    return this.componentRef.instance.selectedItem;
  }

  loadValue(item: any) {
    const itemObject = item && item[this.columnDef.field];
    this.componentRef.instance.selectedItem = itemObject && itemObject;
  }

  serializeValue(): any {
    return this.componentRef.instance.selectedItem;
  }

  isValueChanged() {
    return (
      !(
        this.componentRef.instance.selectedItem === '' &&
        (this.defaultItem === null || this.defaultItem === undefined)
      ) && this.componentRef.instance.selectedItem !== this.defaultItem
    );
  }

  validate(): EditorValidationResult {
    if (this.validator) {
      const value = this.componentRef.instance.selectedItem;
      return this.validator(value, this.args);
    }

    // by default the editor is always valid
    // if user want it to be required, he would have to provide his own validator
    return {
      valid: true,
      msg: null,
    };
  }
}
