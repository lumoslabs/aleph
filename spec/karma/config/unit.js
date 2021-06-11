// Karma configuration
// Generated on Mon Feb 03 2014 16:16:15 GMT+0100 (CET)

module.exports = function (config) {
  var cfg = {
    // base path, based on tmp/ folder
    basePath: '..',

    // frameworks to use
    frameworks: ['jasmine'],

    // list of files / patterns to load in the browser
    files: [
      APPLICATION_SPEC,
      'app/assets/javascripts/*.js*',
      'spec/javascripts/support/*.js*',
      'spec/javascripts/**/*_spec.js*'
    ],

    // list of files to exclude
    exclude: [],

    // test results reporter to use
    // possible values: 'dots', 'progress', 'junit', 'growl', 'coverage'
    reporters: ['progress', 'coverage'],

    // web server port
    port: 9876,

    // enable / disable colors in the output (reporters and logs)
    colors: true,

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,

    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera (has to be installed with `npm install karma-opera-launcher`)
    // - Safari (only Mac; has to be installed with `npm install karma-safari-launcher`)
    // - PhantomJS
    // - IE (only Windows; has to be installed with `npm install karma-ie-launcher`)
    browsers: ['Chrome'],

    customLaunchers: {
      Chrome_travis_ci: {
        base: 'Chrome',
        flags: ['--no-sandbox']
      }
    },

    // If browser does not capture in given timeout [ms], kill it
    captureTimeout: 60000,

    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: false,

    // Preprocessors
    preprocessors: {
      // Transpile ES6 to ES5 and check coverage
      '/**/*.js.es6': ['babel', 'sourcemap', 'coverage'],
      // Check coverage for ES5
      'app/assets/javascripts/angular/**/*.js': ['coverage'],
      'app/assets/javascripts/*.js': ['coverage'],
      'app/assets/javascripts/lib/*.js': ['coverage']
    },

    babelPreprocessor: {
      options: {
        sourceMap: 'inline'
      },
      sourceFileName: function (file) {
        return file.originalPath;
      }
    },

    plugins: ['karma-babel-preprocessor', 'karma-sourcemap-loader', 'karma-coverage', 'karma-jasmine'],

    coverageReporter: {
      instrumenters: {
        isparta: require('isparta')
      },
      instrumenter: {
        '**/*.js': 'isparta'
      },
      dir: 'tmp/',
      type: 'lcovonly'
    }
  };

  if (process.env.TRAVIS) {
    cfg.browsers = ['Chrome_travis_ci'];
    cfg.reporters = ['progress', 'coverage', 'coveralls'];
    cfg.coverageReporter = {
      instrumenters: {
        isparta: require('isparta')
      },
      instrumenter: {
        '**/*.js': 'isparta'
      },
      dir: 'tmp/',
      type: 'lcovonly'
    };
  }

  config.set(cfg);
};
