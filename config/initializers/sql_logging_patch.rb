if Rails.application.config.disable_sql_logging
  module ActiveRecord
    class LogSubscriber
      def sql(event);;end
    end
  end
end
