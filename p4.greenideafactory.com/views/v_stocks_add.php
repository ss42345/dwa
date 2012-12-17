<form method='POST' action='/stocks/p_add'>

	<strong>New Stock:</strong><br>
    Select Stock:
    <select id="StockSymbol">
        <option value="apple">Apple (Ticker: AAPL)</option>
        <option value="google">Google (Ticker: GOOG)</option>
        <option value="microsoft">Microsoft (Ticker: MSFT)</option>
        <option value="amazon">Amazon (Ticker: AMZN)</option>
    </select>

    <table bgcolor=#87ceeb>

        <tr>
            <td ><input type="checkbox" id="SMA">Simple Moving Avg</td>
            <td> </td>
        </tr>
        <tr>
            <td>SMA Period:</td>
            <td><input type="text" id="SMAPeriod"/> </td>
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
            <td><input type="text" id="EMAPeriod"/></td>
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
            <td><input type="text" id="StochasticPeriod1"/></td>
        </tr>
        <tr>
            <td>Second Period:</td>
            <td><input type="text" id="StochasticPeriod2"> </td>
        </tr>

    </table>
	<br><br>
    <table>
        <tr>
            <input type="button" id="computebutton" value="Compute Trading Signals"/>
        </tr>
        <tr>
            <input type="submit" value="Add Stock">
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