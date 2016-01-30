module.exports = function(grunt) {
    var _ = require('lodash');   

    grunt.loadNpmTasks('grunt-shell-spawn');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-smushit');

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        smushit: {
            texture: {
                src: 'texture/**/*.png'
            }
        },
        shell: {
            excel2json: {
                command: "sh " + __dirname + "/../resource/tool/encrypt.sh"
            },
            packTexPNG: {
                command: [
                    "python",
                    __dirname + "/tools/packTexture.py",
                    __dirname, "texture", "res/img", "png", "RGBA8888"
                    ].join(" "),
            },
            packTexPVR: {
                command: [
                    "python",
                    __dirname + "/tools/packTexture.py",
                    __dirname, "texture", "res/img", "pvr2ccz", "RGBA8888"
                    ].join(" "),
            },
            availableTasks: {
                command: "grunt --help | grep -A 100 'Available tasks'"
            },
            options: { stdout: true, stderr: true, failOnError: true }
        },
        watch: {
            texture: {
                files: ["texture/**/*.png"],
                tasks: ["packtex"],
                options: {"atBegin": true}
            },
            jslist: {
                files: ["proj.html5/cocos2d.js"],
                tasks: ["syncjs"]
            },
            excel: {
                files: ["../resource/excel/*.xlsx"],
                tasks: ["e2j", "gen-completion-stub"]
            },
            preload: {
                files: ["res/particles/*", "res/font/*", "res/*", "res/armature/*", "res/ccbi/*", ],
                tasks: ["preload"]
            }
        },
        syncjs: {
        }
    }); 

    grunt.registerTask('default', 'List available tasks.', ['shell:availableTasks']);
    grunt.registerTask('packtex', "Packing Textures", ['shell:packTexPNG']);
    grunt.registerTask('e2j', "Convert excels to json", ['shell:excel2json']);

    /*grunt.registerTask('ios', function() {
        grunt.log.writeln("TBD.");
    });

    grunt.registerTask('android', function() {
        grunt.log.writeln("TBD.");
    });*/

    grunt.registerTask('gen-completion-stub', "Generate stub js for WebStorm auto completion", function() {
        var confs = grunt.file.expand({}, ["proj.html5/res/conf/*.json"]);
        var stub = {};
        _.each(confs, function(conf) {
            var json = grunt.file.readJSON(conf);
            stub[conf] = _.values(json)[0];
        });
        var jsonstr = "var COMPLETION_STUB = " + JSON.stringify(stub, null, 4) + ";";
        grunt.file.write("proj.html5/completion_stub.js", jsonstr);
    });

    grunt.registerTask('syncjs', "Sync js file list from cocos2d.js to build.xml and jsb", function() {
        var opts = grunt.config("syncjs");

        // extract js file list from cocos2d.js
        var src = grunt.file.read(opts.h5);
        var files = src.match(/appFiles\s*:\s*\[([^\]]+)\]/mi)[1].split(',');
        files = _.map(files, function(f) { return f.trim();});
        files = _.filter(files, function(f) { return f.length != 0;});

        grunt.log.writeln(files.length +" files totally:");
        grunt.log.write(_.map(files, function(f) { return "\t" + f;}).join("\n"));
        grunt.log.writeln();

        // update build.xml for html5 proj
        var html5files = _.union(files, ["'main.js'"]);
        var xmls = _.map(html5files, function(f) { 
            return "                <file name=" + f + "/>"
        });
        var buildxml = grunt.file.read(opts.ant);
        var regex = /(\s+<sources dir="\${basedir}">)((?:.|[\r\n])*?)(\s+<\/sources>)/mi;
        buildxml = buildxml.replace(regex, "$1\n" + xmls.join("\n") + "$3");
        grunt.file.write(opts.ant, buildxml);
        
        // update jsb.js 
        var jsb = grunt.file.read(opts.jsb);
        var jsbFiles = _.reject(files, function(name) { // exclude html5 stub files
            return name.indexOf("html5_stub") != -1;
        });
        var jsblist = _.map(jsbFiles, function(f) { return "    " + f}).join(",\n").replace(",\n$", "\n");
        jsb = jsb.replace(/(var appFiles\s*=\s*\[)([^\]]+)\]/mi, "$1\n" + jsblist + "\n]");
        grunt.file.write(opts.jsb, jsb);
    });

    grunt.registerTask('preload', "Update preload resource list for html5", function() {
        var path = ["*.ccbi", "img/*", "armature/*", "font/*", "particle/*",
                    "sound/bgm/*", "sound/effect/*", "conf/*.json", "ccbi/*"];

        var files = grunt.file.expand({cwd: "res" }, path);
        grunt.log.write("hehe", files);
        files = _.filter(files, function(file){
            return file.indexOf(".orig") == -1 && file.indexOf(".db") === -1;
        });
        console.log(files + "dd");
        //grunt.log.write(_.map(files, function(f) { return "\t" + f;}).join("\n"));
        grunt.log.write("preload list updated, totally " + files.length + " files.\n");
        var res = grunt.file.read("src/resource.js");
        var code = _.map(files, function(f) { return '    "' + "res/" + f + '"'}).join(",\n").replace(",\n$", "\n");
        res = res.replace(/(var g_resources\s*=\s*\[)([^\]]+)\]/mi, "$1\n" + code + "\n]");
        grunt.log.write(res);
        grunt.file.write("src/resource.js", res);
    });
}; 
