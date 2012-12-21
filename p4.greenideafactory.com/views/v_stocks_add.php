<form method='POST' action='/stocks/p_add'>

    <br><br>
    <strong>Enter Stock Ticker Symbol:</strong>
    <input type="text" name="stock" id="StockSymbol"/>
    <br><br>
    Select Time Period:
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
    <select name="DataPeriod">
        <option value="one_month">One Month</option>
        <option value="three_months">Three Months</option>
        <option value="six_months">Six Months</option>
    </select>
    <br><br>
    <input type="button" id="getstockdata" value="Get Stock Data"/>
    <br><br><br>


    <table bgcolor=#87ceeb>

        <tr>
            <td ><input type="checkbox" id="SMA">Simple Moving Avg</td>
            <td> </td>
        </tr>
        <tr>
            <td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;SMA Period:</td>
            <td><input type="text" name="SMAPeriod" id="SMAPeriod"/> </td>
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
            <td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;EMA Period:</td>
            <td><input type="text" name="EMAPeriod" id="EMAPeriod"/></td>
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
            <td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;First Period:</td>
            <td><input type="text" name="StochasticPeriod1" id="StochasticPeriod1"/></td>
        </tr>
        <tr>
            <td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Second Period:</td>
            <td><input type="text" name="StochasticPeriod2" id="StochasticPeriod2"/> </td>
        </tr>

    </table>
	<br><br>
    <table>
        <tr>
            <input type="button" id="computebutton" value="Compute Trading Signals"/>
        </tr>
        <tr>
            <input type="submit" id="addtowatchlist" value="Add to Watch list">
        </tr>
    </table>
    <div id="chartArea">
        <h3>&nbsp;&nbsp;&nbsp;Steps to follow:</h3><br>
        <ul>
        <li> Enter the stock ticker symbol</li>
        <li> Select the time period</li>
        <li> Click the "Get Stock Data" button to retrieve the price history of the stock and to plot it</li>
        <li> Check one or more trading signals </li>
        <li> Select appropriate time period parameters for the chosen signal(s)</li>
        <li> Click the "Compute Trading Signals" button</li>
        <li> Each signal will provide its buy or sell trading price in the message window</li>
        <li> Good luck and hope you make money trading!</li>
        </ul>

    </div>
    <table>
        <div id="messageWindow">
        </div>
    </table>
    <br><br><br><br>


</form>