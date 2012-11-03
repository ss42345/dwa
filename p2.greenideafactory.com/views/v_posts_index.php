<? if (!empty($posts)): ?>
	<? foreach($posts as $post): ?>
	
		<h3><?=$post['first_name']?> <?=$post['last_name']?> posted:</h3>
		<?=$post['content']?>
	
	<br>
	
	<? endforeach; ?>
<? else: ?>
	<h3> There are no posts to view. </h3>
<? endif; ?>