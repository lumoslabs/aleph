class SchemaCommentMatcher
  KEY_DELIM = '_'.freeze

  def self.load_cache
    @cache = {}
    comments = SchemaComment.all
    comments.each do |comment|
      k = [comment.schema, comment.table, comment.column, comment.target_type].join(KEY_DELIM)
      @cache[k] = comment
    end
  end

  def self.enrich(columns)
    load_cache

    columns.each do |column|
      k = [column[:schema], column[:table], column[:column], column[:type]].join(KEY_DELIM)
      comment = @cache[k]

      if comment.present?
        column[:comment_text] = comment.text
        column[:comment_user_id] = comment.user_id
        column[:comment_id] = comment.id
      end
    end
  end
end
