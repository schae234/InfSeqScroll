function ReadMapper(div){
    // Create the sequence frams
    this.seq_frame = new SequenceFrame(div)
    this.search_box = new SearchBox(div)
    this.chromo_map = new ChromoMap(div)

}

SequReadMapper.prototype = new ReadMapper()
SequenceFrame.prototype.constructor = SequenceFrame
function SequenceFrame(pdiv){

}

SearchBox = new ReadMapper()
SearchBox.constructor = SearchBox
function SearchBox(pdiv){

}

ChromoMap = new ReadMapper()
Chromomap.constructor = ChromoMap
function ChromoMap(pdiv){

}
