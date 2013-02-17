<? if(isset($message)): ?>
	<h3> <?=$message?> </h3>
<? else: ?>

	<? if(!$user): ?>
		<h3>Welcome to the Stock Trading Signal Wizard by Green Idea Factory!</h3>
        <h3>Please login.</h3>
	<? else: ?>
		<h2>Welcome <?=$user->first_name?>!</h2><br>
	<? endif; ?>

<? endif; ?>


