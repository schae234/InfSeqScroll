<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html  lang="en" xml:lang="en" xmlns="http://www.w3.org/1999/xhtml" >
<head>
	<meta content="text/html;charset=utf-8" http-equiv="Content-Type"></meta>
    <title>Maize Sequence Read Mapper</title>
    <link href="img/favicon.ico" rel="shortcut icon">
	<script src="js/tools.js" type="text/javascript"></script>
    <script src="js/ReadMapper.js" type="text/javascript"></script>
    <link type="text/css" rel="stylesheet" href="css/main.css"></link>

	<script type="text/javascript">
		function init(){
			window.rm = new ReadMapper(document.getElementById("ReadMapper"))
            rm.init()
		}
	</script>
    <script type="text/javascript">

      var _gaq = _gaq || [];
      _gaq.push(['_setAccount', 'UA-37038437-1']);
      _gaq.push(['_trackPageview']);

      (function() {
        var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
        ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
        var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
      })();

    </script>

</head>

<body onload="init()">
    <div id="ReadMapper">
</div>
</body>


</html>

