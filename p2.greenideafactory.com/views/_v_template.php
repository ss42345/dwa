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

	<div id="container">

		<!-- Header -->
		<div id="header">
			<h1>
				Green Idea Exchange Forum
			</h1>
		</div>
	
		<!-- SubHeader -->
		<div>
			<h2>
			<table id="subheader">
				<tr>
  					<td><a href='/'>Home</a></td>
  					<td><a href='/users/signup'>Sign up</a></td>
	  				<td><a href='/users/login'>Log in</a></td>
  					<td><a href='/users/logout'>Log out</a></td>
				</tr>
			</table>
			</h2>
		</div>

		<!-- Left Menu -->
		<div id="menu">
	
			<!-- Menu for users who are logged in -->
			<? if($user): ?>
			
				<a href='/users/logout'>Logout</a><br>
				<a href='/posts/users/'>Change who you're following</a><br>
				<a href='/posts/'>View posts</a><br>
				<a href='/posts/add'>Add a new post</a><br>
		
			<!-- Menu options for users who are not logged in -->	
			<? else: ?>
		
				<a href='/users/signup'>Sign up</a>
				<a href='/users/login'>Log in</a>
		
			<? endif; ?>
		</div>

		<!-- Main body -->
		<div id="mainbody">
			<?=$content;?> 
		</div>

	</div>
	
</body>

</html>