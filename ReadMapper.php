<?php

$rm = new ReadMapper($_POST['args']);

class ReadMapper{
    var $ok_query;
    var $JSON_out;
    var $post;

    function ReadMapper($POST){
        // Set up the Database Connection
        $this->dbase = 'ReadMapper';
        $this->host = 'localhost:9906';
        $this->usr = 'rschae';
        $this->pwd = chop(file_get_contents("ReadMapper_Password.txt"));
        $this->con = mysql_connect($this->host,$this->usr,$this->pwd);
        if(!$this->con){
            die('Could not connect: ' . mysql_error());
        }
        if(!mysql_select_db($this->dbase, $this->con)){
            die('Could not connect: ' . mysql_error());
        }
        // The return object is just JSON
        $this->JSON_out = array();
        // Keep all the posted data
        $this->post = json_decode($POST,true);
        // Now take action 
        $this->take_action();
        // Clean up after yourself
        mysql_close();
        exit;
    }
    /*  Public Functions  */
    public function take_action(){
        try{
            $action = $this->post['action'];
            $this->$action();
		    echo json_encode($this->JSON_out);	
        }
        catch(Exception $e){
            $this->_error('failed to take action');
        }
    }
    /*  Private Functions */
	private function _error($msg){
		$this->add_json('action','error');
		$this->add_json('err_msg',$msg);
        return json_encode($this->JSON_out);
        exit;
	}
    private function _make_query($query, $params=false){
	        if ($params) {
			    foreach ($params as &$v) {
				    $v = mysql_real_escape_string($v);
			    }
			    $query = str_replace("%","%%",$query);
			    $query = vsprintf( str_replace("?","%s",$query), $params );
			}
            try{
			    $this->ok_query = mysql_query($query, $this->con);
            }
            catch(Exception $e){
                $this->_error('Database error: ' . $e->getMessage()); 
            }
			return $this->ok_query;
    }
    private function get_chunk_by_id(){
        $chunk = $this->post['chunk'];
        $chr = $this->post['chr'];
        $this->_make_query("SELECT chunk, chr, start, end, seq FROM chromo_chunks WHERE chunk = ? AND chr = ?",array($chunk,$chr));
        $row = mysql_fetch_array($this->ok_query,MYSQL_ASSOC);
        $this->JSON_out = $row;
    }
    private function get_chromo_details(){
        $this->_make_query("SELECT chr, length, num_chunks FROM chromo_details",array());
        $this->JSON_out['details'] = array();
        while($row=mysql_fetch_array($this->ok_query,MYSQL_ASSOC)){\
            array_push($this->JSON_out['details']['chromosomes'][$row['chr']]['length'] = $row['length']);
            array_push($this->JSON_out['details']['chromosomes'][$row['chr']]['num_chunks'] = $row['num_chunks']);
        }
        // Get the max chromo length
        $this->_make_query("SELECT max(length) as max_chromo_length FROM chromo_details",array());
        while($row=mysql_fetch_array($this->ok_query,MYSQL_ASSOC)){
            $this->JSON_out['details']['max_chromo_length'] = $row['max_chromo_length'];
        }
    }
}
?>
