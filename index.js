var fs = require('fs')
var path = require('path')
var env = require('xdg-env')

var mime = module.exports = {}

var GLOB_EXTENSIONS = Object.create(null)
var GLOB_REGEXP = []

/*var DIRS = env.DATA_DIRS.map(function(dir){
	return path.join(dir, 'mime')
}).filter(fs.existsSync)*/

;(function(){
	var ESCAPE_REG_EXP =  /([.+?^=!:${}()|\/\\])/g
	var EXTENSION_GLOB_REGEXP = /^\*\.[^\*\?\[]+$/

	function glob2regexp(glob, sensitive){
		return new RegExp('^' + glob.replace(ESCAPE_REG_EXP, '\\$1').replace(/\*/g, '.*') + '$', sensitive ? '' : 'i')
	}

	for(var i = 0, dir; dir = env.DATA_DIRS[i]; i++){
		try{
			var content = fs.readFileSync( path.join(dir, 'mime/globs2'), 'utf-8' )
		} catch(e){
			continue
		}

		var lines = content.split('\n')

		for(var j = 0, line; line = lines[j]; j++){

			if(line.charAt(0) === '#')
				continue;

			var glob = line.split(':')
			var cs = glob[3] === 'cs'

			if(!cs && EXTENSION_GLOB_REGEXP.test(glob[2])){
				var ext = glob[2].substring(2).toLowerCase()
				if(!GLOB_EXTENSIONS[ext])
					GLOB_EXTENSIONS[ext] = glob[1];

			} else{
				GLOB_REGEXP.push([glob2regexp(glob[2], cs), glob[1]])
			}
		}
	}
})()


function lookup(file, fallback){
	var basename = path.basename(file)
	var ext = basename.toLowerCase()
	var subi
	var type

	while((subi = ext.indexOf('.') + 1) && (ext = ext.substring(subi))){
		if(type = GLOB_EXTENSIONS[ext])
			return type;
	}

	for(var i = 0, glob; glob = GLOB_REGEXP[i]; i++){
		if(glob[0].test(basename))
			return glob[1];
	}
	
	return arguments.length > 1 ? fallback : mime.default_type
}

mime.default_type = null
mime.lookup = lookup
mime.GLOB_EXTENSIONS = GLOB_EXTENSIONS
mime.GLOB_REGEXP = GLOB_REGEXP