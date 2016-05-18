class AlephLogFormatter < Logger::Formatter
  def call(severity, timestamp, _progname, msg)
    "#{timestamp.to_formatted_s(:db)} #{severity} #{msg}\n"
  end
end
