Gem::Specification.new do |s|
  s.name        = 'aleph_analytics'
  s.version     = '0.3.0'
  s.date        = '2019-02-26'
  s.summary     = 'Redshift analytics platform'
  s.description = 'The best way to develop and share queries/investigations/results within an analytics team'
  s.authors     = ['Andrew Xue', 'Rob Froetscher']
  s.email       = 'andrew@lumoslabs.com'
  s.files       = Dir.glob('{app,bin,lib,config,vendor}/**/*') +
                  # need to find the hidden sprockets manifest in public/assets
                  Dir.glob('public/assets/**/*', File::FNM_DOTMATCH) +
                  Dir.glob('public/resources/**/*') +
                  Dir.glob('public/*.*') +
                  Dir.glob('db/migrate/*') +
                  Dir.glob('playground_data/*') +
                  %w(config.ru Rakefile LICENSE README.md ROADMAP.md CHANGELOG.md Gemfile Gemfile.lock Procfile)
  s.executables = %w(aleph)
  s.homepage    = 'https://github.com/lumoslabs/aleph'
  s.license     = 'MIT'
  s.add_dependency 'bundler', '~> 1.7'
  s.add_dependency 'highline', '~> 1.6'
end
