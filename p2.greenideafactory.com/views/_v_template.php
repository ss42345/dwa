<!DOCTYPE html>
<html>
<head>
	<title><?=@$title; ?></title>

	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />	
	
	<!-- JS -->
	<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.8.1/jquery.min.js"></script>
	<script src="http://ajax.googleapis.com/ajax/libs/jqueryui/1.8.23/jquery-ui.min.js"></script>
				
	<!-- CSS -->			
	<link rel="stylesheet" type="text/css" href="/css/users.css"/>
					
	<!-- Controller Specific JS/CSS -->
	<?=@$client_files; ?>
	
</head>

<body>	
	<!-- Title Row -->
    <div class="title row">
	</div>

	<!-- Header -->
    <div class="header row">
    	<div class="left col center">
    		<a href='/'><h3>Home</h3></a>
    	</div>
    	<div class="right col center">
    	<h1>
			Green Idea Exchange Forum
		</h1>
  	</div>
    </div>
 
    <div class="mainbody">
        <div class="left col">
                <ul class="listview">
						<!-- Menu for users who are logged in -->
						<? if($user): ?>
							<li><a href='/posts/users/'>Following</a></li>
							<li><a href='/users/showall/'>All Users</a></li>
							<li><a href='/posts/add'>New Post</a></li>
							<li><a href='/posts/'>View Posts</a></li>
							<li><a href='/users/logout'>Logout</a></li>

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
 
    <div class="footer row">
    	<div class="left col">
    	</div>
    	<div class="right col">
    		<div>

			</div>
    	</div>
    </div>
	
</body>

</html>
