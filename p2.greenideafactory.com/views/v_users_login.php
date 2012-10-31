<form method='POST' action='/users/p_login'>
	Email<br>
	<input type='text' name='email'>
	
	<br><br>
	
	Password<br>
	<input type='password' name='password'>
	
	<br><br>
	<? if($error): ?>
		<div class='error'>
			Login failed. Please double check your email and password.
		</div>
		<br>
	<? endif; ?>
	
	<input type='submit'>
	
</form>
	