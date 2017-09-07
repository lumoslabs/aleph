namespace :karma  do
  task :start => :environment do
    with_tmp_config :start
  end

  task :run => :environment do
    with_tmp_config :start, "--single-run"
  end

  private

  def with_tmp_config(command, args = nil)
    pass = false
    Tempfile.open('karma_unit.js', Rails.root.join('spec') ) do |f|
      f.write unit_js(application_spec_files)
      f.flush
      pass = system "karma #{command} #{f.path} #{args}"
    end
    exit(!!pass)
  end

  def application_spec_files
    sprockets = Rails.application.assets
    sprockets.append_path Rails.root.join("spec/karma")
    files = Rails.application.assets.find_asset("application_spec.js").to_a.select { |e| e.pathname.to_s.end_with?('.js', '.es6')}.map {|e| e.pathname.to_s }
  end

  def unit_js(files)
    unit_js = File.open('spec/karma/config/unit.js', 'r').read
    unit_js.gsub "APPLICATION_SPEC", "\"#{files.join("\",\n\"")}\""
  end
end
