!(angular => {
  'use strict';

  /*
    DirtyAwareModel-ish model with no concept isNew() (since there is no initItem).
    Provides a facade via the composition of the schema column and schema comments
  */

  function SchemaColumnImports(SchemaCommentResource, ModelState, AlertFlash) {

    return class SchemaColumn {

      constructor() {
        this.modelState = new ModelState(['comment_text']);
        this.item = {};
      }

      internalize(item) {
        this.item = item;
      }

      set item(item) {
        this._item = item;
        this.modelState.snapshotItem(this._item);
      }

      get item() {
        return this._item;
      }

      isPersisted() {
        return _.exists(this.item.comment_id);
      }

      isPristine() {
        if(!this.isPersisted()) return false;
        return this.modelState.isPristine(this.item);
      }

      isDirty() {
        return !this.isPristine();
      }

      isValidForSave() {
        return !this.isPersisted() || this.modelState.isDirty(this.item);
      }


      save() {
        let comment = this._toCommentObject();
        let err = AlertFlash.emitError.bind(AlertFlash, 'Failed to save comment, id = ' + comment.id);

        if(this.isPersisted()) {
          return SchemaCommentResource.update(comment).$promise.catch(err);
        } else if(this.modelState.isDirty(this.item)) {
          return SchemaCommentResource.create(comment).$promise.catch(err);
        }
      }

      //private methods

      _toCommentObject() {
        return {
          id: this.item.comment_id,
          text: this.item.comment_text,
          schema: this.item.schema,
          table: this.item.table,
          column: this.item.column,
          target_type: this.item.type // Comment field called 'target_type' because 'type' is special for for Rails STI
        };
      }
    };
  }

  SchemaColumnImports.$inject = ['SchemaCommentResource', 'ModelState', 'AlertFlash'];
  angular.module('alephServices.schema.column', []).service('SchemaColumn', SchemaColumnImports);

}(angular));
