<? if (!$mystocks): ?>
<h3><?=$user->first_name?>, you have no stocks in your watchlist yet.</h3>
<? else: ?>
<h3><?=$user->first_name?>, you have the following stocks in your watchlist:</h3>
<? foreach($mystocks as $mystock): ?>

    <h4><?=$mystock['stock']?>:</h4>

    <? endforeach; ?>
<? endif; ?>