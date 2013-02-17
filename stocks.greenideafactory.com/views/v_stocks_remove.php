<form method='POST' action='/stocks/p_remove'>

    <? if (!$mystocks): ?>
        <h3><?=$user->first_name?>, you have no stocks in your watchlist.</h3>
    <? else: ?>
        <h3><?=$user->first_name?>'s Stock Watchlist:</h3>

        <h4> Select Stocks to Remove from Watchlist</h4>

        <? foreach($mystocks as $mystock): ?>

            <input type="checkbox" name="remove_stocks[]" value="<?=$mystock['stock']?>"> <?=$mystock['stock']?> <br>

        <? endforeach; ?>

        <br>
	    <input type="submit" value="Remove">
    <? endif; ?>
</form>

