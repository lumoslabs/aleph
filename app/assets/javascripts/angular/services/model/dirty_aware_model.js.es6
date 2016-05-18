!(angular => {
  'use strict';

  function DirtyAwareModelImports(ModelBase, ModelState) {

    return class DirtyAwareModel extends ModelBase {

      constructor(resource, fields, comparators) {
        super(resource);
        this.modelState = new ModelState(fields, comparators);
      }

      set item(item) {
        this._item = item;

        if(this.modelState) {
          this.modelState.snapshotItem(this._item);
        }
      }

      get item() {
        return this._item;
      }

      isPristine() {
        if(this.isNew()) return true;
        if(!this.isPersisted()) return false;

        return this.modelState.isPristine(this.item);
      }

      isDirty() {
        return !this.isPristine();
      }

      revert() {
        this._item = this.modelState.snapshot;
      }

      isValidForSave() {
        return this.isNew() || !this.isPersisted() || this.modelState.isDirty(this.item);
      }

    };
  }

  DirtyAwareModelImports.$inject = ['ModelBase', 'ModelState'];
  angular.module('models.dirtyAwareModel', []).service('DirtyAwareModel', DirtyAwareModelImports);

}(angular));
