class Summarizer
  MERGE_WITH_PLUS =  -> (_k, o, n) { o + n }

  def initialize(collection, options = {})
    @collection = collection
    @merge_type =  options[:merge_type] || MERGE_WITH_PLUS
  end

  def reduce(inital_state, &block)
    @collection.reduce(inital_state, &merge_step(block))
  end

  private

  def merge_step(step_block)
    -> (state, i) { state.merge(step_block.call(i), &@merge_type) }
  end
end
