module.exports = function (grunt) {

  grunt.initConfig({

    jshint: {
      options: {
        jshintrc: true
      },
      all: ['src/**/*.js', 'test/**/*.js']
    },

    concat: {
      options: {
        separator: ';',
      },
      dist: {
        src: ['src/contextWrapper.js', 'src/memeify.js'],
        dest: 'dist/build.js',
      },
    },

    uglify: {
      options: {
        mangle: false
      },
      dist: {
        files: {'dist/build.min.js': ['dist/build.js']}
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');

  grunt.registerTask('default', ['jshint', 'concat', 'uglify']);
}
