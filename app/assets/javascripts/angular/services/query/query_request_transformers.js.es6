!(angular => {
  'use strict';

  function QueryRequestTransformers() {
    const saveFields =  ['id', 'title', 'body', 'tags', 'result_id', 'version', 'roles', 'latest_result_s3_url_flag'];

    // see https://github.com/mbenford/ngTagsInput
    function transformNgTagsInput(fieldName, query) {
      let ngTags = query[fieldName];
      if (_.exists(ngTags)) {
        query[fieldName] = _.map(ngTags, ngTagItem =>  _.exists(ngTagItem.text) ? ngTagItem.text : ngTagItem);
      }
      return query;
    }

    return [
      query => transformNgTagsInput('tags', query),
      query => transformNgTagsInput('roles', query),
      query => { return { query: _.selectKeys(query, saveFields) }; },
      angular.toJson
    ];
  }

  angular.module('alephServices.queryRequestTransformers', [])
    .service('QueryRequestTransformers', QueryRequestTransformers);
}(angular));
