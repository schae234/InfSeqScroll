/* Read Mapper

*/
function ReadMapper(div){
    // Create the sequence frams
    this.seq_frame = new SequenceFrame(div)
    this.search_box = new SearchBox(div)
    this.chromo_map = new ChromoMap(div)
	
	this.div = div;
	this.div.className="ReadMapper"

}

ReadMapper.prototype.hello = function(){
	alert("hello world")
}

/* Sequence Frame

*/

function SequenceFrame(pdiv){
	// generate the frame
	this.frame = document.createElement("div")
	this.frame.className = "SequenceFrame";
	pdiv.appendChild(this.frame)
}
SequenceFrame.prototype = heir(ReadMapper.prototype)

/* Search Box

*/

function SearchBox(pdiv){

}
SearchBox.prototype = heir(ReadMapper.prototype)

SearchBox.prototype.world = function(){
	alert('goodbye world')
}

/* Chromo Map

*/

function ChromoMap(pdiv){

}
ChromoMap.prototype = heir(ReadMapper.prototype)
