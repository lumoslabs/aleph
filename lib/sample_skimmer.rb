class SampleSkimmer
  def initialize(num_sample_rows, &callback)
    @num_sample_rows = num_sample_rows
    @callback = callback
    @samples = []
    @callback_called = false
  end

  def callbacks
    { during_execute: collect_samples, after_execute: submit_data_if_unsubmitted }
  end

  private

  def collect_samples
    lambda do |row, row_count|
      if row_count <= @num_sample_rows
        @samples << row
        if row_count == @num_sample_rows
          @callback.call(@samples)
          @callback_called = true
        end
      end
    end      
  end

  def submit_data_if_unsubmitted
    ->(row_count) { @callback.call(@samples) unless @callback_called }
  end
end
