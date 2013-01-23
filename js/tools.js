// Better Inheritence

function heir(p){
	function f() {}
	f.prototype = p
	return new f()
}
