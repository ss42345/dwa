<!DOCTYPE html>
<html>
<head>
	<title><?=@$title; ?></title>

	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />

    <!-- CSS -->
    <link rel="stylesheet" type="text/css" href="/css/users.css"/>
    <link rel="stylesheet" type="text/css" href="/css/trading.css"/>

    <!-- JS -->
	<!---
    <script src="http://ajax.googleapis.com/ajax/libs/jquery/1.8.1/jquery.min.js"></script>
	<script src="http://ajax.googleapis.com/ajax/libs/jqueryui/1.8.23/jquery-ui.min.js"></script>
	<script type="text/javascript" src="http://www.google.com/jsapi"></script>
	--->

    <!--- Local version of the JS files ----
    <script src="/js/jsapi.js"></script>
    <script src="/js/jquery-1.8.3.min.js"></script>
    <script src="/js/stockfunctions.js"></script>
    <script src="/js/stockdata.js"></script>
    ---->

	<!-- Controller Specific JS/CSS -->
	<?=@$client_files; ?>
	
</head>

<body>
	<!-- Header -->
    <div class="header row">
    	<div class="header left">
    		<a href='/'><h3>Home</h3></a>
    	</div>
    	<div class="header right">
    	<h2>
			Stock Trading Signal Wizard
		</h2>
  	</div>
    </div>
 
    <div class="mainbody">
        <div class="left menu">
                <ul class="listview">
						<!-- Menu for users who are logged in -->
						<? if($user): ?>
							<li><a href='/users/logout'>Logout</a></li>
                            <li><a href='/stocks/add'>Trading Signals</a></li>
                            <li><a href='/stocks/remove'>Manage Watchlist</a></li>

						<!-- Menu options for users who are not logged in -->	
						<? else: ?>
		
							<li><a href='/users/signup'>Sign up</a></li>
							<li><a href='/users/login'>Log in</a></li>
					
						<? endif; ?>
                </ul>
	    </div>

		<!-- Scrollable output window -->
    	<div class="scroll">
			<?=$content;?> 
	    </div>

    </div>
 
    <div id="StockDataHolder">

    </div>

</body>

</html>
