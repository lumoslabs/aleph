# For further explanation, check out RFC 2183
# https://www.ietf.org/rfc/rfc2183.txt
ActionController.add_renderer :csv do |obj, options|
  filename = options.fetch(:filename, 'data')

  disposition_type = options[:inline] || filename == 'inline' ? 'inline' : 'attachment'
  disposition_params = [disposition_type]
  if filename != 'inline'
    filename = "#{filename}.csv" unless filename =~ /\.csv$/
    disposition_params << "filename=#{filename}"
  end

  str = obj.respond_to?(:to_csv) ? obj.to_csv : obj.to_s
  send_data str, type: Mime::CSV, disposition: disposition_params.join(';')
end
