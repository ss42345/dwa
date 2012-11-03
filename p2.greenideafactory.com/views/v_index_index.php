
<? if(!$user): ?>
	<h2>Welcome to Green Idea Exchange Forum. Please login.</h2><br>
<? else: ?>
	<h2>Welcome back <?=$user->first_name?></h2><br>
<? endif; ?>


