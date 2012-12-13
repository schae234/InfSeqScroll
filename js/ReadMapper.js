/* Read Mapper

*/
function ReadMapper(div){
    // Initialize the inner HTML
	this.div = div;
    this.div.innerHTML = "<h3>Sequence Mapper</h3>"
    // Initialize the Ajax Object
    this.ajax = new Ajax("http://csbio.cs.umn.edu/MaizeOutreach/ReadMapper.php") 
    // chromo details    
    this.details = new Array()
    // Fore closures
    var caller = this

    //////////////////
    // Sequence Frame
    //////////////////
	this.frame = document.createElement("div")
	this.frame.className = "SequenceFrame";
    this.frame.onscroll = function(){
        caller.check_scroll.apply(caller)
    }
	this.div.appendChild(this.frame)

    //////////////////
    // Search Box
    /////////////////
    this.searchbox = document.createElement("input")
    this.searchbox.className = "SearchBox"
    // attach it
    this.div.appendChild(this.searchbox)
    // Generate the search button
    this.submit = document.createElement("button")
    this.submit.onclick = function(){
        caller.find_sequence()
    }
    this.submit.innerHTML = "Search"
    this.div.appendChild(this.submit)
    
    this.ajax.snd_msg(
        {'action':'get_chromo_details'},
        function(response){
            caller.details = response.details; 
        }
    )


    ////////////////////////
    // Methods
    /////////////////////

    this.fetch_additional_frame = function(){
        if(this.cur_chunk == this.get_max_chunk()){
            alert("You Reached the End of the Chromosome!")
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
    }

    this.add_to_frame = function(JSON){ 
        this.cur_chunk = JSON.chunk
        this.frame.innerHTML += JSON.seq
    }

    this.clear = function(){
        this.frame.innerHTML = ''
    }

    this.get_max_length = function(){
        return this.details[this.chr]['length']
    }

    this.get_max_chunk = function(){
        return this.details[this.chr]['num_chunks']
    }

  
    this.check_scroll = function(){
        if(this.frame.scrollHeight-this.frame.scrollTop-this.frame.offsetHeight < 200){
            this.fetch_additional_frame()
        }
    }
  
    this.load_chromosome = function(chr){
        this.chr = chr
        this.cur_chunk = 1
        this.clear()
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
        var patt = new RegExp(this.searchbox.value,"gi")
        this.frame.innerHTML=this.frame.innerHTML.replace(patt,"<span class='highlighted'>"+this.searchbox.value+"</span>")
        
    }
}

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
