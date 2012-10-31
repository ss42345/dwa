<pre>
Hello World!
Controller: c_index.php
Method: index()
View: v_index_index.php

<? if(!$user): ?>
	Welcome stranger<br>
<? else: ?>
	Welcome back <?=$user->first_name?><br>
<? endif; ?>


</pre>
