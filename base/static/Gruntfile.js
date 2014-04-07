var fs = require('fs');

module.exports = function(grunt)
{
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jade');
  grunt.loadNpmTasks('grunt-contrib-stylus');
  grunt.loadNpmTasks('grunt-ngmin');
  grunt.loadNpmTasks('grunt-html2js');
  grunt.loadNpmTasks('grunt-notify');

  grunt.initConfig({
    clean: {
      build: ['build'],
      dist: ['dist'],
      tmp: ['tmp']
    },

    copy: {
      js: {
        files: [
          {
            src: ['src/app/**/*.js'],
            dest: 'build',
            expand: true
          }
        ]
      },
      source_map: {
        files: [
          {
            src: ['build/**/*.js'],
            dest: 'dist/assets/sources/',
            flatten: true,
            expand: true,
            filter: 'isFile'
          }
        ]
      }
    },

    concat: {
      css: {
        src: ['src/app/**/*.css'],
        dest: 'dist/assets/style.css'
      },

      app: {
        src: [
          'build/src/app/app.js',
          'build/src/app/**/*.js',
          'build/src/common/**/*.js'
        ],
        dest: 'dist/assets/app.js'
      }
    },

    ngmin: {
      compile: {
        files: [
          {
            src: ['assets/app.js'],
            cwd: 'build',
            dest: 'dist',
            expand: true
          }
        ]
      }
    },

    notify: {
      build: {
        options: {
          message: 'Build Complete'
        }
      },
      dist: {
        options: {
          message: 'Dist Complete'
        }
      }
    },

    notify_hooks: {
      options: {
        enabled: true,
        max_jshint_notifications: 20,
        title: "Bici Robadas"
      }
    },

    uglify: {
      options: {
        sourceMap: 'dist/js/sources/source-map.js',
        sourceMapRoot: '/js/sources/',
        sourceMappingURL: 'sources/source-map.js'
        //sourceMapPrefix: 3
      },
      dist: {
        files: {
          'dist/js/app.js': [
            'build/src/app/app.js',
            'build/src/app/**/*.js',
            'build/src/common/**/*.js'
          ]
        }
      }
    },

    jshint: {
      src: [
        'src/app/**/*.js'
      ],
      gruntfile: [
        'Gruntfile.js'
      ],
      options: {
        debug: true,
        curly: true,
        immed: true,
        newcap: true,
        noarg: true,
        sub: true,
        boss: true,
        eqnull: true,
        '-W100': true,
        '-W024': true
      },
      globals: {}
    },

    html2js: {
      build: {
        options: {
          htmlmin: {
            collapseBooleanAttributes: true,
            collapseWhitespace: true,
            removeComments: true,
            removeRedundantAttributes: true,
            removeScriptTypeAttributes: true,
            removeStyleLinkTypeAttributes: true
            //lint: true
          },
          base: 'tmp/src/app/',
          module: 'templates-app'
        },
        src: ['tmp/src/**/*.tpl.html'],
        dest: 'build/src/app/templates-app.js'
      }
    },

    index: {
      build: {
        options: {
          dir: 'build'
        },
        src: [
          'build/src/app/app.js',
          '<%= html2js.build.dest %>',
          'build/src/app/**/*.js',
          'build/!src/*.js',
          'build/!src/**/*.spec.js',
          'build/src/**/*.css'
        ]
      },
      dist: {
        options: {
          dir: 'dist'
        },
        src: ['assets/app.js', 'assets/style.css']
      }
    },

    jade: {
      build: {
        files: [{
          expand: true,
          src: ["src/**/*.jade"],
          dest: "tmp/.",
          ext: ".tpl.html"
        }]
      }
    },

    stylus: {
      options: {
        compress: false
      },
      build: {
        files: [{
          expand: true,
          src: ["src/**/*.styl"],
          dest: "build/.",
          ext: ".css"
        }]
      }
    },

    delta: {
      options: {
        livereload: true,
        spawn: false
      },

      gruntfile: {
        files: 'Gruntfile.js',
        tasks: [ 'jshint:gruntfile' ],
        options: {
          livereload: false
        }
      },

      jssrc: {
        files: ['src/app/**/*.js'],
        tasks: ['jshint:src', 'copy:js', 'notify:build']
      },

      css: {
        files: ['src/**/*.styl'],
        tasks: ['stylus', 'notify:build']
      },

      html: {
        files: [ 'src/index.html' ],
        tasks: [ 'index:build', 'notify:build' ]
      },

      jade: {
        files: ['src/**/*.jade'],
        tasks: ['jade', 'html2js', 'notify:build']
      }
    }
  });

  grunt.renameTask('watch', 'delta');
  grunt.registerTask('watch', [
    'notify_hooks',
    'build',
    'delta'
  ]);

  grunt.registerTask('test', [
    'build',
    'compile',
    'hashres:prod',
    'replace'
  ]);

  grunt.registerTask('build', [
    'clean:build',
    'clean:tmp',
    'jade',
    'html2js',
    'jshint',
    'stylus',
    'copy:js',
    'index:build',
    'notify:build'
  ]);

  grunt.registerTask('dist', [
    'clean:dist',
    'clean:tmp',
    'ngmin',
    'concat',
    'copy:source_maps',
    'uglify',
    'index:dist',
    'notify:compile'
  ]);

  grunt.registerTask('default', ['watch']);

  grunt.registerTask('test', [
    'stylus'
  ]);

  grunt.registerMultiTask('index', 'Process index.html template', function()
  {
    var filesSrc = this.filesSrc,
      options = this.options(),
      dirRE = new RegExp('^\/?' + options.dir, 'g' ),
      files, jsFiles, cssFiles;

    function cleanFilePath(file) {
      return file.replace(dirRE, '');
    }

    if (this.target == 'build') {
      filesSrc = filesSrc.map(function(src) {
        return '/' + src;
      });
    }

    files = grunt.util._.flatten(filesSrc);
    jsFiles = filterForJS(files).map(cleanFilePath);
    cssFiles = filterForCSS(files).map(cleanFilePath);

    grunt.file.copy('src/index.html', options.dir + '/index.html', {
      process: function(contents, path)
      {
        return grunt.template.process( contents, {
          data: {
            scripts: jsFiles,
            styles: cssFiles
          }
        });
      }
    });

  });

  function filterForExp(files, exp) {
    return files.filter(function(file)
    {
      return file.match(exp);
    });
  }

  function filterForJS(files) {
    return filterForExp(files, /\.js$/ );
  }

  function filterForCSS(files) {
    return filterForExp(files, /\.css$/ );
  }
};
