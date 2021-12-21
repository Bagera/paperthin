module.exports = function (grunt)
{
	grunt.initConfig({
		bake:
		{
			options:
			{
				// disable {{interpolation}}

				parsePattern: /##(.*?)##/g,
			},

			// conditionally bake test or release placeholders

			test:
			{
				options: { content: { test: true } },
				files: { 'format.html': 'source.html' }
			},

			release:
			{
				options: { content: { test: false } },
				files: { 'format.html': 'source.html' }
			}
		},

		clean: ['dist/'],

		watch:
		{
			source:
			{
				files: ['source.html'],
				tasks: ['default']
			}
		}
	});

	// custom task to merge a JSON-ified version of
	// format.html into format.json, then write a JSONP-ified
	// version to dist/format.js

	grunt.registerTask('compileformat', 'Compiles format.json and format.html to dist/format.js',
	function()
	{
		// merge format.html into format.json

		const pkg = grunt.file.readJSON('package.json');
		const template = grunt.file.read('format.html');

		const formatData = {
			name: pkg.name,
			version: pkg.version,
			description: pkg.description,
			author: pkg.author.replace(/ <.*>/, ''),
			image: 'icon.svg',
			url: pkg.repository,
			license: pkg.license, 
			proofing: true,
			source: template,
		}

		grunt.file.write('dist/' + pkg.name + '/format.js', 'window.storyFormat(' + JSON.stringify(formatData) + ');');

		// if an image is set, copy that too

		if (pkg.image)
			grunt.file.copy(pkg.image, 'dist/' + pkg.name + '/' + pkg.image);
	});

	grunt.loadNpmTasks('grunt-bake');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.registerTask('default', ['bake:test']);
	grunt.registerTask('release', ['clean', 'bake:release', 'compileformat']);
};
