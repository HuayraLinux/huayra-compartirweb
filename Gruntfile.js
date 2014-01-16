var shelljs = require('shelljs');

module.exports = function(grunt) {

	grunt.initConfig({	
    nodewebkit: {
                  options: {
                            //version: '0.8.3',
                            version: '0.7.5',
                            build_dir: './webkitbuilds',
                            mac: true,
                            win: true,
                            linux32: true,
                            linux64: true
                },
                src: [
                  './src/**/*',
                  './node_modules/**/*',
                ]
            }
  });
	
  grunt.loadNpmTasks('grunt-node-webkit-builder');
  grunt.registerTask('clear', ['clear']);

  grunt.registerTask('clear', "Limpia la pantalla", function() {
    shelljs.exec('clear');
  });

  grunt.registerTask('default', ['clear']);
};

