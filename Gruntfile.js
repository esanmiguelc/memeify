module.exports = function (grunt) {

  grunt.initConfig({
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

  grunt.registerTask('default', ['concat', 'uglify']);
}
