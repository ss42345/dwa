<? foreach($allusers as $auser): ?>
	
	<h4><?=$auser['first_name']?> <?=$auser['last_name']?>: <?=$auser['email']?></h4>
	
<? endforeach; ?>