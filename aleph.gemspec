Gem::Specification.new do |s|
  s.name        = 'Aleph'
  s.version     = '0.0.0'
  s.date        = '2016-05-18'
  s.summary     = 'Redshift analytics platform'
  s.description = 'The best way to save and share queries/investigations/results within an analytics team'
  s.authors     = ['Andrew Xue', 'Rob Froetscher']
  s.email       = 'andrew@lumoslabs.com'
  s.files       = Dir.glob('{app,bin,lib,config,vendor}/**/*') +
                  Dir.glob('public/resources/**/*') +
                  Dir.glob('db/migrate/*') +
                  %w(config.ru Rakefile LICENSE README.md ROADMAP.md CHANGELOG.md)
  s.executables = %w(playground run)
  s.homepage    = 'https://github.com/lumoslabs/aleph'
  s.license     = 'MIT'
end
