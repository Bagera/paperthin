module.exports = function (grunt) {
	grunt.initConfig({
		story: grunt.file.readJSON("data/story.json"),
		storyCss: grunt.file.read("src/style.css"),
		storyJs: grunt.file.read("src/main.js"),
    pkg: grunt.file.readJSON("package.json"),

    bake: {
      test: {
        options: { content: {
					name: "<%= story.test.name %>",
					data: "<%= story.test.data %>",
					css: "<%= storyCss %>",
					js: "<%= storyJs %>",
					pkg: "<%= pkg %>"
				} },
        files: {
          "dist/<%= pkg.name %>-<%= pkg.version %>/test.html":
            "src/template.html",
        },
      },
      release: {
        options: { content: {
					name: "<%= story.release.name %>",
					data: "<%= story.release.data %>",
					css: "<%= storyCss %>",
					js: "<%= storyJs %>",
					pkg: "<%= pkg %>"
				} },
        files: {
          "dist/<%= pkg.name %>-<%= pkg.version %>/template.html": "src/template.html",
        },
      },
    },

    clean: ["dist/"],

    watch: {
      source: {
        files: ["src/*.*", ],
        tasks: ["default"],
      },
    },
  });

  // custom task to merge a JSON-ified version of
  // template.html into format.json, then write a JSONP-ified
  // version to dist/format.js

  grunt.registerTask(
    "compileformat",
    "Compiles package.json and template.html to dist/[pkg.name]-[pkg-version]/format.js",
    function () {
      const pkg = grunt.file.readJSON("package.json");
      const dest = "dist/" + pkg.name + "-" + pkg.version + "/";
      const template = grunt.file.read(dest + "template.html");

      const formatData = {
        name: pkg.name,
        version: pkg.version,
        description: pkg.description,
        author: pkg.author.replace(/ <.*>/, ""),
        image: "icon.svg",
        url: pkg.repository,
        license: pkg.license,
        proofing: true,
        source: template,
      };

      grunt.file.write(
        dest + "format.js",
        "window.storyFormat(" + JSON.stringify(formatData) + ");"
      );

      // if an image is set, copy that too

      if (formatData.image) grunt.file.copy('src/' + formatData.image, dest + formatData.image);
    }
  );

  grunt.loadNpmTasks("grunt-bake");
  grunt.loadNpmTasks("grunt-contrib-clean");
  grunt.loadNpmTasks("grunt-contrib-watch");
  grunt.registerTask("default", ["clean", "bake:test"]);
  grunt.registerTask("release", ["clean", "bake:test", "bake:release", "compileformat"]);
};
