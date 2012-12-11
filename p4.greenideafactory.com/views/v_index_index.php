<? if(isset($message)): ?>
	<h3> <?=$message?> </h3>
<? else: ?>

	<? if(!$user): ?>
		<h2>Welcome to Stock Trading Signals by Green Idea Factory! Please login.</h2><br>
	<? else: ?>
		<h2>Welcome <?=$user->first_name?>!</h2><br>
	<? endif; ?>

<? endif; ?>


