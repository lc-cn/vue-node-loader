
const fs = require('fs')
const {compile} = require('./lib')

const extensions=Reflect.get(module, '_extensions')
const compileToModule=Reflect.get(module,'_compile')
extensions['.vue']=function (m,filename) {
	const code=fs.readFileSync(filename,'utf-8')
	m.exports=compileToModule(compile(code,filename))
}
