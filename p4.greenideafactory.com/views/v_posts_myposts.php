<? if (!$myposts): ?>
	<h3><?=$user->first_name?>, you have no posts yet.</h3>	
<? else: ?>
	<h3><?=$user->first_name?> posted:</h3>
	<? foreach($myposts as $mypost): ?>
	
		<h4>On <?=date("D M j G:i:s T Y", $mypost['created'])?>:</h4>
			<?=$mypost['content']?>
	
	<? endforeach; ?>
<? endif; ?>