module.exports = function (grunt) {

  grunt.initConfig({
    concat: {
      options: {
        separator: ';',
      },
      dist: {
        src: ['src/contextWrapper.js', 'src/memeify.js'],
        dest: 'build.js',
      },
    },
  });

  grunt.loadNpmTasks('grunt-contrib-concat');

  grunt.registerTask('default', ['concat']);
}
