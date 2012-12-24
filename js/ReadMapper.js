/* Read Mapper

*/
function ReadMapper(div){
    // Initialize the inner HTML
	this.div = div;
    this.div.className = "ReadMapper"
    this.div.innerHTML = "<h3>Sequence Mapper</h3>"
    // Initialize the Ajax Object
    this.ajax = new Ajax("http://csbio.cs.umn.edu/MaizeOutreach/ReadMapper.php") 
    // chromo details    
    this.details = new Array()
	this.highlighted_sequence = ''
    // For closures
    var caller = this

    ///////////////////////////////////////
    // Sequence Frame
    ///////////////////////////////////////
	this.frame = document.createElement("div")
	this.frame.className = "SequenceFrame";
    this.frame.onscroll = function(){
        caller.check_scroll.apply(caller)
    }
	this.div.appendChild(this.frame)

    // Generate the search button
    
    ///////////////////////////////////////
    // Chromo Map
    ///////////////////////////////////////
    this.chromosomes = new Array()
    this.chromomap = document.createElement("div")
    this.chromomap.className = "ChromoMap" 
    this.div.appendChild(this.chromomap)

    ////////////////////////////////////////
    // Search Box
    ////////////////////////////////////////
    this.searchbox = new SearchBox()
    var caller = this;
    this.searchbox.add_click_function(
        function(){
            caller.find_sequence()
        }
    )
    this.div.appendChild(this.searchbox.div)


    this.init = function(){
        // Grab the details from the server
        // load the chromosomes
        this.ajax.snd_msg(
            {'action':'get_chromo_details'},
            function(response){
                caller.load_details.apply(caller,[response])
            }
        )
    }

    ////////////////////////
    // Methods
    /////////////////////

    this.load_details = function(response){
        this.details = response.details; 
        for(var chr_num in this.details.chromosomes){
            this.add_map_chromo(chr_num,this.details.chromosomes[chr_num].length) 
        }
        // init default chromosome
        this.load_chromosome(1,1)
    }

    this.add_map_chromo = function(number,length){
        var chr = new Chromosome(length,this.details.max_chromo_length,number)
        var caller = this;
        chr.div.onclick = function(e){
            // get the right coordinates
            var percentage = 0;
            var offsetY = this.offsetTop-this.scrollTop;
            var originalTarget = this;
            while(originalTarget = originalTarget.offsetParent){
                offsetY += originalTarget.offsetTop-originalTarget.scrollTop;
            }
            var percentage = parseInt(((e.pageY-offsetY)/caller.chromosomes[number].div.offsetHeight)*100)
            //caller.chromosomes[number].move_pointer(percentage)
            caller.load_chromosome(number,percentage)
        }
        this.chromosomes[number]= chr
        this.chromomap.appendChild(chr.div)
        return this
    }

    this.fetch_additional_frame = function(){
        if(this.cur_chunk == this.get_max_chunk()){
            return
        }
        this.cur_chunk++
        console.log("fetching chunk" + this.cur_chunk)
        this.ajax.snd_msg(
            {"action":"get_chunk_by_id","chunk":this.cur_chunk,"chr":this.chr},
            function(response){
                caller.add_to_frame.apply(caller,[response])
            }
        )
        return this
    }

    this.add_to_frame = function(JSON){ 
		var chunk = new Chunk(JSON)
        this.cur_chunk = JSON.chunk
        this.frame.appendChild(chunk)
        this.move_chromosome_pointer()
		this.find_sequence()
    }

    this.clear = function(){
        this.frame.innerHTML = ''
    }

    this.get_max_length = function(){
        return this.chromosomes[this.chr]['length']
    }

    this.get_max_chunk = function(){
        return this.details.chromosomes[this.chr]['num_chunks']
    }

  
    this.check_scroll = function(){
        if(this.frame.scrollHeight-this.frame.scrollTop-this.frame.offsetHeight < 200){
            this.fetch_additional_frame()
        }
    }
    this.select_chromosome = function(chr_num,percent){
        // check to see if this is the first time
        if(this.selected_chromosome != undefined){
            this.chromosomes[this.selected_chromosome].unselect()
        }
        this.selected_chromosome = chr_num
        this.chromosomes[this.selected_chromosome].select(percent)
        this.chromosomes[this.selected_chromosome].set_pointer(percent)
    }
  
    this.load_chromosome = function(chr,percent){
        if(chr > (this.chromosomes.length-1) || chr < 1){
            return null;
        }
        if(percent > 100){
            percent = 100   
        }
        if(percent < 1){
            percent = 1
        }
        this.chr = chr
        this.cur_chunk = parseInt(percent*this.get_max_chunk()/100)
        this.clear()
        this.select_chromosome(chr,percent)
        var caller = this
        // Grab the starting sequence from the database
        this.ajax.snd_msg(
            {"action":"get_chunk_by_id", "chunk":this.cur_chunk, "chr": this.chr },
            function(response){
                caller.add_to_frame.apply(caller,[response])
            }
        )
    }
    
    this.find_sequence = function(){ 
        var query = this.searchbox.get_query()
		if(query == ''){
			return;
		}
		var chunks = this.frame.childNodes
		for(var i = 0; i < chunks.length; i++){
			if(chunks[i].attributes.highlighted_text == query){
				continue;
			}
			else{
				chunks[i].innerHTML
				= chunks[i].attributes.seq.value.replace(RegExp(query,'gi'),"<span class='highlighted'>"+query.toUpperCase()+"</span>")
				chunks[i].setAttribute("highlighted_seq",query)
			}
		}
		this.highlighted_sequence = query;
    }
    this.move_chromosome_pointer = function(){
        var percent = parseInt(this.cur_chunk/(this.get_max_chunk())*100)
        this.chromosomes[this.selected_chromosome].set_pointer(percent)
    }
}
ReadMapper.prototype

/* Ajax Class
*/
function Ajax(src){
	this.src = src;
}

Ajax.prototype.snd_msg = function(JSON, response){
    var wrapper;
    var req;
    // make sure that the callback function is actually a function
    if(typeof(response) !== 'function'){
        return undefined;
    }
    // Create new XMLreq for Mozilla/Safari
    if (window.XMLHttpRequest) {
       req = new XMLHttpRequest();
    }
    // handle IE XMLreq
    else if (window.ActiveXObject) {
       req = new ActiveXObject("Microsoft.XMLHTTP");
    }
    req.open("POST",this.src ,true);
    req.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
    req.onreadystatechange = function(){
        if(req.readyState == 4 && req.status==200){
                response(window.JSON.parse(req.responseText));
        }
    }
    req.send("args="+window.JSON.stringify(JSON));
}// end snd_msg


function Chromosome(length,max_height,chr_num){
    this.length = length
    // create a div
    this.div = document.createElement('div')
    this.div.className = "Chromosome"
    // Create The Chromosome number
	var num = document.createElement("span")
	num.innerHTML = chr_num.toString()
	//this.div.appendChild(num)
   
    // Set the height 
    this.div.style.height = parseInt(parseInt(length)/parseInt(max_height)*100) + '%'

    // Add a pointer
    this.pointer = document.createElement("div")
    this.pointer.className = "ChromosomePointer"
    this.div.appendChild(this.pointer); 

    this.select = function(percent){
        this.div.className = "Chromosome Selected"
        this.pointer.className = "ChromosomePointer Selected"
    }
    this.unselect = function(){
        this.div.className = "Chromosome"
        this.pointer.className = "ChromosomePointer"
    }
    this.set_pointer = function(percent){
        this.pointer.style.top = parseInt(percent*this.div.offsetHeight/100) + 'px'
    }

}

function SearchBox(){
    this.div = document.createElement("div")
    this.div.className = "SearchBox"
    // attach the query box 
    this.querybox = document.createElement("input")
    this.div.appendChild(this.querybox)
    // attach the submit button
    this.submit = document.createElement("button")
    this.submit.innerHTML = "Search"
    this.div.appendChild(this.submit)

    this.add_click_function = function(func){
        this.submit.onclick = func
        return this;
    }
    
    this.get_query = function(){
        return this.querybox.value
    }

}
	
function Chunk(obj){
	var div   = document.createElement('div')
	div.setAttribute('chunk', obj.chunk)
	div.setAttribute('seq'  , obj.seq)
	div.setAttribute('class','chunk')
	div.innerHTML = obj.seq
	div.setAttribute('highlighted_text','')
	return div
}
