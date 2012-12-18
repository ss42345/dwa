<form method='POST' action='/stocks/p_add'>

    <?
    $SMAPeriod = 10;
    $EMAPeriod = 10;
    $StochasticPeriod1 = 14;
    $StochasticPeriod2 = 5;
    ?>

    <!-- Initialize the form fields -->
    <script>
    $(":input[name='SMAPeriod']").val($SMAPeriod);
    $(":input[name='EMAPeriod']").val($EMAPeriod);
    $(":input[name='StochasticPeriod1']").val($StochasticPeriod1);
    $(":input[name='StochasticPeriod2']").val($StochasticPeriod2);
    </script>

    <strong>Enter Stock Ticker Symbol:</strong>
    <input type="text" name="stock"/>
    <br><br>
    Select Time Period:
    <select name="DataPeriod">
        <option value="one_month">One Month</option>
        <option value="three_months">Three Months</option>
        <option value="six_months">Six Months</option>
    </select>
    <br><br>

    <table bgcolor=#87ceeb>

        <tr>
            <td ><input type="checkbox" id="SMA">Simple Moving Avg</td>
            <td> </td>
        </tr>
        <tr>
            <td>SMA Period:</td>
            <td><input type="text" name="SMAPeriod"/> </td>
        </tr>
        <tr>
            <td> </td>
            <td> </td>
        </tr>
        <tr>
            <td><input type="checkbox" id="EMA">Exponential Moving Avg</td>
            <td><br> </td>
        </tr>
        <tr>
            <td>EMA Period:</td>
            <td><input type="text" name="EMAPeriod"/></td>
        </tr>
        <tr>
            <td> </td>
            <td> </td>
        </tr>
        <tr>
            <td><input type="checkbox" id="Stochastic"> Stochastics</td>
            <td> </td>
        </tr>
        <tr>
            <td>First Period:</td>
            <td><input type="text" name="StochasticPeriod1"/></td>
        </tr>
        <tr>
            <td>Second Period:</td>
            <td><input type="text" name="StochasticPeriod2"> </td>
        </tr>

    </table>
	<br><br>
    <table>
        <tr>
            <input type="button" id="computebutton" value="Compute Trading Signals"/>
        </tr>
        <tr>
            <input type="submit" value="Add to Watchlist">
        </tr>
    </table>
    <div id="chartArea">
    </div>
    <div id="messageWindow">
    </div>
    <div id="result">
        <div id="SMASignal"></div>
        <div id="EMASignal"></div>
        <div id="StochasticSignal"></div>
    </div>

    <br><br><br><br>


</form>