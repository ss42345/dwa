$(document).ready(function() { // start doc ready; do not delete this!

    //alert("Inside stockfunctions document");

    var debugging = false;

    var SMAPeriod = 10;
    var EMAPeriod = 10;
    var StochasticPeriod1 = 14;
    var StochasticPeriod2 = 5;

    // Global variables
    var gIdxDate = 0;
    var gIdxOpen = 1;
    var gIdxHigh = 2;
    var gIdxLow  = 3;
    var gIdxClose = 4;
    var gIdxVolume = 5;
    var gIdxAdjClose = 6;
    var gCurrentStockData = new Array();
    var gCurrentPriceData = new Array();
    var gCurrentPriceLegend = new Array();
    var gCurrentPlotData  = new Array();
    var gCurrentPlotLegend = new Array();
    var gLegendArray = new Array();

    var useSMA = false;
    var useEMA = false;
    var useStochastic = false;

    var SymbolValid = true;
    var StockDataValid = true;
    var SMAPeriodValid = true;
    var EMAPeriodValid = true;
    var StochasticPeriod1Valid = true;
    var StochasticPeriod2Valid = true;

    // Initialize the form fields
    $('#SMAPeriod').val(SMAPeriod);
    $('#EMAPeriod').val(EMAPeriod);
    $('#StochasticPeriod1').val(StochasticPeriod1);
    $('#StochasticPeriod2').val(StochasticPeriod2);

    // Compute Trading Signals Button Click
    $("#computebutton").click(function() {

        SymbolValid = true;
        StockDataValid = true;
        var stockSymbol = $('#StockSymbol').val();
        var retVal = ValidateStockSymbol(stockSymbol);
        if (!retVal.valid) {
            $('#StockSymbol').css("background-color","pink");
            DisplayMessage(retVal.msg);
            SymbolValid = false;
            return false;
        }
        else {
            $('#StockSymbol').css("background-color","white");
        }

        if (gCurrentPriceData.length == 0) {
            DisplayMessage("First get the stock data before computing trading signals.")
            return false;
        }

        // Change the cursor
        $("body").css("cursor", "progress");

        // Clear any existing data
        ClearAllResults();

        // Compute trading signals
        if (SymbolValid && StockDataValid && useSMA && SMAPeriodValid) {
            RefreshSMAResults();
        }
        if (SymbolValid && StockDataValid && useEMA && EMAPeriodValid) {
            RefreshEMAResults();
        }
        if (SymbolValid && StockDataValid && useStochastic && StochasticPeriod1Valid && StochasticPeriod2Valid) {
            RefreshStochasticResults();
        }

        // Reset the cursor
        $("body").css("cursor", "default");
    });

    function ClearAllResults() {
        //$('#SMASignal').html('');
        //$('#EMASignal').html('');
        //$('#StochasticSignal').html('');
        if (SymbolValid && StockDataValid && SMAPeriodValid && EMAPeriodValid && StochasticPeriod1Valid && StochasticPeriod2Valid) {
            $('#messageWindow').html('');
        }
        if (!useSMA && !useEMA && !useStochastic) {
            DisplayMessage('Please check the checkbox next to at least one trading signal');
        }
        // Reset current plot data
        gCurrentPlotData = Clone2D(gCurrentPriceData);
        gCurrentPlotLegend = Clone1D(gCurrentPriceLegend);
    }

    // This function constructs the quoteString based on the user selection
    function getQuoteString() {
        //
        //Example: s=MSFT&d=11&e=19&f=2012&g=d&a=11&b=1&c=2012
        //
        var endpart = "&ignore=.csv";
        var symbol = $('#StockSymbol').val();
        var today = new Date();
        d=today.getMonth();
        e=today.getDate();
        f=today.getFullYear();

        period = $('select').val();
        switch (period) {
            case "one_month":
                a = d-1;
                break;
            case "three_months":
                a=d-3;
                break;
            case "six_months":
                a=d-6;
                break;
        }
        b=e;
        c=f;
        if (a < 0) {
            a = 12+a;
            c = c-1;
        }
        var quoteString = "s="+symbol + "&d="+d + "&e="+e + "&f="+f + "&g=d" + "&a=" + a + "&b=" + b + "&c=" + c + endpart;
        return quoteString;
    }

    // Adding to watch list
    $("#addtowatchlist").click(function() {
        SymbolValid = true;
        StockDataValid = true;
        var stockSymbol = $('#StockSymbol').val();
        var retVal = ValidateStockSymbol(stockSymbol);
        if (!retVal.valid) {
            $('#StockSymbol').css("background-color","pink");
            DisplayMessage(retVal.msg);
            SymbolValid = false;
            return false;
        }
        else {
            $('#StockSymbol').css("background-color","white");
        }

        if (gCurrentPriceData.length == 0) {
            DisplayMessage("First get the stock data before adding the stock to the watch list.")
            return false;
        }
    })

    // User clicks on the getStockData button
    $("#getstockdata").click(function() {

        // Clear any existing data
        $('#messageWindow').html('');

        SymbolValid = true;
        StockDataValid = true;
        var stockSymbol = $('#StockSymbol').val();
        var retVal = ValidateStockSymbol(stockSymbol);
        if (!retVal.valid) {
            $('#StockSymbol').css("background-color","pink");
            DisplayMessage(retVal.msg);
            SymbolValid = false;
            return;
        }
        else {
            $('#StockSymbol').css("background-color","white");
        }

        var quoteString = getQuoteString();

        // Change the cursor
        $("body").css("cursor", "progress");

        $("#StockDataHolder").load("/stocks/getstockdata/"+quoteString, function(responseText, statusText, xhr) {
                if (statusText == "success") {
                    // Get the stock data as a js array, and legend array.
                    // Also set the global variable
                    if ((responseText.search(/not/i) >= 0) ||
                        (responseText.search(/error/i) >= 0) ||
                        (responseText.search(/yahoo/i) >= 0) ||
                        (responseText.search(/found/i) >= 0 )) {

                        StockDataValid = false;
                        DisplayMessage("Failed to retrieve stock data");
                        $('#StockSymbol').css("background-color","pink");

                        // Reset the cursor
                        $("body").css("cursor", "default");
                        return;
                    }

                    var jsArray = new Array();
                    var legendArray = new Array();
                    ConvertToJSArray(responseText, jsArray, legendArray);
                    gCurrentStockData = jsArray.reverse();
                    gLegendArray = legendArray;

                    // Extract the closing price of the stock and plot
                    gCurrentPriceData = ExtractClosePrice(jsArray);
                    gCurrentPriceLegend = [gLegendArray[gIdxDate], gLegendArray[gIdxClose]];
                    drawStockChart(gCurrentPriceData, gCurrentPriceLegend);
                }

                if (statusText == "error")
                    alert("Ajax - Error"+xhr.status+":"+xhr.statusText);
        })
        $("#StockDataHolder").hide();

        // Reset the cursor
        $("body").css("cursor", "default");
    });

    // This function converts the input data in text format to JS array format
    function ConvertToJSArray(dataText, retArray, retLegendArray) {
        var strArrayIn = dataText.split('\\n');

        // Skip the last row while looping
        for (var i=0; i < strArrayIn.length-1; i++) {
            var row = strArrayIn[i];

            var rowItems = row.split(',');
            if (i == 0) {
                // Special case: Titles of columns
                retLegendArray[gIdxDate] = rowItems[gIdxDate];
                retLegendArray[gIdxOpen] = rowItems[gIdxOpen];
                retLegendArray[gIdxHigh] = rowItems[gIdxHigh];
                retLegendArray[gIdxLow]  = rowItems[gIdxLow];
                retLegendArray[gIdxClose]  = "Price"; //rowItems[gIdxClose];
                retLegendArray[gIdxVolume] = rowItems[gIdxVolume];
                retLegendArray[gIdxAdjClose] = rowItems[gIdxAdjClose];
            }
            else {
                retArray[i-1] = new Array();

                // Extract numerical information
                retArray[i-1][gIdxDate] = rowItems[gIdxDate];
                retArray[i-1][gIdxOpen] = Number(rowItems[gIdxOpen]);
                retArray[i-1][gIdxHigh] = Number(rowItems[gIdxHigh]);
                retArray[i-1][gIdxLow]  = Number(rowItems[gIdxLow]);
                retArray[i-1][gIdxClose]  = Number(rowItems[gIdxClose]);
                retArray[i-1][gIdxVolume] = Number(rowItems[gIdxVolume]);
                retArray[i-1][gIdxAdjClose]  = Number(rowItems[gIdxAdjClose]);

                if (debugging) {
                    for (var j=0; j <= gIdxAdjClose; j++) {
                        console.log(retArray[i-1][j]);
                    }
                }
            }
        }
    }

    // Function to clone a 1D array
    function Clone1D(arrayIn) {
        var arrayOut = arrayIn.slice(0);
        return arrayOut;
    }

    // Function to clone a 2D array
    function Clone2D(arrayIn) {
        var arrayOut = Clone1D(arrayIn);

        // Loop over all the rows
        for (var i=0; i < arrayIn.length; i++) {
            arrayOut[i] = Clone1D(arrayIn[i]);
        }
        return arrayOut;
    }

    // This function extracts the close price of the stock
    function ExtractClosePrice(jsArrayIn) {
        var retArray = Clone2D(jsArrayIn);

        // Loop over all the rows
        for (var i=0; i < retArray.length; i++) {
            retArray[i].splice(1,3);
            retArray[i].splice(2,2);
        }
        return retArray;
    }

    // This function appends a column to the end of the array
    // NOTE: It modifies the input array
    function AppendColumn(jsArrayIn, columnIn) {
        var retArray = jsArrayIn; //Clone2D(jsArrayIn);

        // Loop over all the rows
        for (var i=0; i < retArray.length; i++) {
            retArray[i].splice(retArray.length,0,columnIn[i]);
        }
        return retArray;

    }

    function DisplayInformation(message){
        //console.log(message);
        $('#chartArea').html(message);
    }

    function DisplayMessage(message){
        //console.log(message);
        $('#messageWindow').html("<h4>Warning:</h4>" + message );
    }

    function DisplaySignal(type, signal, price) {
        signalStr = "<b> " + type + " Signal:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + "</b>";
        priceStr = signal + " at <i>$" + price.toString() + "</i>";
        $('#messageWindow').append("<h4><tr><td>"+signalStr+"</td><td>"+priceStr+"</td></tr></h4>");
    }

    $('#StockSymbol').change(function() {
        SymbolValid = true;
        stockSymbol = $(this).val();
        var retVal = ValidateStockSymbol(stockSymbol);
        if (!retVal.valid) {
            $('#StockSymbol').css("background-color","pink");
            DisplayMessage(retVal.msg);
            SymbolValid = false;
        }
        else {
            // Clear existing messages
            $('#messageWindow').html('');
            $('#StockSymbol').css("background-color","white");
        }
    })

    function ValidateStockSymbol(symbol){
        var isValid = true;
        if (symbol.length == 0 || symbol.length > 6) {
            isValid = false;
            message = "Enter a valid stock ticker symbol";
        }
        else if (symbol.search("[\\s\\W]+") >= 0) {
            var message = "Enter a valid stock ticker symbol";
            isValid = false;
        }
        return {valid: isValid, msg: message}
    }

    $('#DataPeriod').change(function() {
        // Reset
        gCurrentStockData = new Array();
        gCurrentPriceData = new Array();
        //gCurrentPriceLegend = new Array();
        gCurrentPlotData  = new Array();
        //gCurrentPlotLegend = new Array();
        //gLegendArray = new Array();
    })

    function ValidatePeriod(name, period){
        var isValid = true;
        if (isNaN(period)) {
            isValid = false;
            message = "Enter a valid number";
        }
        else if (period <= 1 || period > gCurrentStockData.length) {
            var message = name + ": Enter a valid number between 2 and " + gCurrentStockData.length.toString();
            isValid = false;
        }
        return {valid: isValid, msg: message}
    }
    //------------------------------------------
    // Trading Signal 1 - Simple Moving Average
    //------------------------------------------
    $('#SMA').change(function() {
        useSMA = ($(this).is(':checked')) ? true : false;
    })

    $('#SMAPeriod').change(function() {
        SMAPeriodValid = true;
        SMAPeriod = $(this).val();
        var retVal = ValidatePeriod("SMAPeriod",SMAPeriod);
        if (!retVal.valid) {
            $('#SMAPeriod').css("background-color","pink");
            DisplayMessage(retVal.msg);
            SMAPeriodValid = false;
        }
        else {
            $('#SMAPeriod').css("background-color","white");
        }
    });

    function RefreshSMAResults() {
        var stockSMA = ComputeSMA(gCurrentStockData, gIdxClose, SMAPeriod);
        var sigSMA = ComputeLatestCrossover(gCurrentStockData, gIdxClose, stockSMA);
        if (sigSMA.up) {
            // Sell signal
            //$('#SMASignal').html("<h3>SMA Signal:</h3><b>Sell at <i>$" + sigSMA.price.toString() + "</i></b>");
            DisplaySignal("SMA","Sell",sigSMA.price);
            //$('#messageWindow').append("<h4>SMA Signal:</h4><b>Sell at <i>$" + sigSMA.price.toString() + "</i></b>");
        }
        else {
            // Buy signal
            //$('#SMASignal').html("<h3>SMA Signal:</h3><b>Buy at <i>$" + sigSMA.price.toString() + "</i></b>");
            DisplaySignal("SMA","Buy",sigSMA.price);
            //$('#messageWindow').append("<h4>SMA Signal:</h4><b>Buy at <i>$" + sigSMA.price.toString() + "</i></b>");
        }
        if (debugging) {
            console.log("SMA");
            PrintToConsole(stockSMA);
        }

        // Append SMA results
        gCurrentPlotData = AppendColumn(gCurrentPlotData, stockSMA);
        if (debugging) {
            console.log("gCurrentPlotData");
            PrintToConsole(gCurrentPlotData);
        }
        gCurrentPlotLegend[gCurrentPlotLegend.length] = "SMA";
        drawStockChart(gCurrentPlotData, gCurrentPlotLegend);
    }

    //-----------------------------------------------
    // Trading Signal 2 - Exponential Moving Average
    //-----------------------------------------------
    $('#EMA').change(function() {
        useEMA = ($(this).is(':checked')) ? true : false;
    })


    $('#EMAPeriod').change(function() {
        EMAPeriodValid = true;
        EMAPeriod = $(this).val();
        var retVal = ValidatePeriod("EMAPeriod",EMAPeriod);
        if (!retVal.valid) {
            $('#EMAPeriod').css("background-color","pink");
            DisplayMessage(retVal.msg);
            EMAPeriodValid = false;
        }
        else {
            $('#EMAPeriod').css("background-color","white");
        }
    });

    function RefreshEMAResults() {
        console.log("gIdxClose = " + gIdxClose);
        console.log("EMAPeriod = " + EMAPeriod);

        var stockEMA = ComputeEMA(gCurrentStockData, gIdxClose, EMAPeriod);
        var sigEMA = ComputeLatestCrossover(gCurrentStockData, gIdxClose, stockEMA);
        if (sigEMA.up) {
            // Sell signal
            //$('#EMASignal').html("<h3>EMA Signal:</h3><b>Sell at <i>$" + sigEMA.price.toString() + "</i></b>");
            DisplaySignal("EMA","Sell",sigEMA.price);
            //$('#messageWindow').append("<h4>EMA Signal:</h4><b>Sell at <i>$" + sigEMA.price.toString() + "</i></b>");
        }
        else {
            // Buy signal
            //$('#EMASignal').html("<h3>EMA Signal:</h3><b>Buy at <i>$" + sigEMA.price.toString() + "</i></b>");
            DisplaySignal("EMA","Buy",sigEMA.price);
            //$('#messageWindow').append("<h4>EMA Signal:</h4><b>Buy at <i>$" + sigEMA.price.toString() + "</i></b>");
        }
        if (debugging) {
            console.log("EMA");
            PrintToConsole(stockEMA);
        }

        // Append EMA results
        gCurrentPlotData = AppendColumn(gCurrentPlotData, stockEMA);
        if (debugging) {
            console.log("gCurrentPlotData");
            PrintToConsole(gCurrentPlotData);
        }
        gCurrentPlotLegend[gCurrentPlotLegend.length] = "EMA";
        drawStockChart(gCurrentPlotData, gCurrentPlotLegend);
    }

    //------------------------------------------
    // Trading Singal 3 - Stochastic Oscillator
    //------------------------------------------
    $('#Stochastic').change(function() {
        useStochastic = ($(this).is(':checked')) ? true : false;
    })


    $('#StochasticPeriod1').change(function() {
        StochasticPeriod1Valid = true;
        StochasticPeriod1 = $(this).val();
        var retVal = ValidatePeriod("StochasticPeriod1",StochasticPeriod1);
        if (!retVal.valid) {
            $('#StochasticPeriod1').css("background-color","pink");
            DisplayMessage(retVal.msg);
            StochasticPeriod1Valid = false;
        }
        else {
            $('#StochasticPeriod1').css("background-color","white");
        }
    });

    $('#StochasticPeriod2').change(function() {
        StochasticPeriod2Valid = true;
        StochasticPeriod2 = $(this).val();
        var retVal = ValidatePeriod("StochasticPeriod2",StochasticPeriod2);
        if (!retVal.valid) {
            $('#StochasticPeriod2').css("background-color","pink");
            DisplayMessage(retVal.msg);
            StochasticPeriod2Valid = false;
        }
        else {
            $('#StochasticPeriod2').css("background-color","white");
        }
    });

    function RefreshStochasticResults() {
        var stochastic = ComputeStochastic(gCurrentStockData, gIdxLow, gIdxHigh, gIdxClose, StochasticPeriod1, StochasticPeriod2);
        var sigStochastic = ComputeLatestCrossoverOfTwoMetrics(stochastic.K, stochastic.D);
        var price = gCurrentStockData[sigStochastic.idx][gIdxClose];
        if (sigStochastic.up) {
            // Sell signal
            //$('#StochasticSignal').html("<h3>Stochastics Signal:</h3><b>Sell at <i>$" + price.toString() + "</i></b>");
            DisplaySignal("Stochastics","Sell",price);
            //$('#messageWindow').append("<tr><td><b>Stochastics Signal:</b></td><td><b>Sell at <i>$" + price.toString() + "</i></b></td></tr>");
        }
        else {
            // Buy signal
            //$('#StochasticSignal').html("<h3>Stochastics Signal:</h3><b>Buy at <i>$" + price.toString() + "</i></b>");
            DisplaySignal("Stochastic", "Buy", price);
            //$('#messageWindow').append("<tr><td><b>Stochastics Signal:</b></td><td><b>Buy at <i>$" + price.toString() + "</i></b></td></tr>");
        }
        if (debugging) {
            console.log("Stochastic.K");
            PrintToConsole(stochastic.K);
            console.log("Stochastic.D");
            PrintToConsole(stochastic.D);
        }

        // Append Stochastic results
        gCurrentPlotData = AppendColumn(gCurrentPlotData, stochastic.K);
        gCurrentPlotData = AppendColumn(gCurrentPlotData, stochastic.D);
        if (debugging) {
            console.log("gCurrentPlotData");
            PrintToConsole(gCurrentPlotData);
        }
        gCurrentPlotLegend[gCurrentPlotLegend.length] = "Stochastic.K";
        gCurrentPlotLegend[gCurrentPlotLegend.length] = "Stochastic.D";
        drawStockChart(gCurrentPlotData, gCurrentPlotLegend);
    }

    //==============================================================
    //------------------ Computational Functions -------------------
    //==============================================================

    // For debugging: Print to console
    function PrintToConsole(dataArray) {
        for (var i=0; i < dataArray.length; i++){
            console.log(dataArray[i]);
        }
    }

    // SMA: Simple Moving Average
    function ComputeSMA(stockData, idx, numPeriods) {
        if (debugging) {
            console.log(stockData);
            console.log('N inside SMA = ' + numPeriods);
        }
        // Initialize return variable
        var SMA = new Array();

        // Initial value
        SMA[0] = stockData[0][idx];
        var runningSum = SMA[0];

        // Recursive computation from the next value
        for (var i=1; i < stockData.length; i++) {
            if (i < numPeriods) {
                runningSum += stockData[i][idx];
                SMA[i] = runningSum/(i+1);
            }
            else {
                // Drop the oldest value
                runningSum += stockData[i][idx] - stockData[i-numPeriods][idx];
                SMA[i] = runningSum/numPeriods;
            }
        }
        return SMA;
    }

    // EMA: Exponential Moving Average
    function ComputeEMA(stockData, idx, numPeriods) {
        // Initialize return variable
        var EMA = new Array();

        // Initial value and computation of alpha
        EMA[0] = stockData[0][idx];
        var alpha = 2/(numPeriods+1);

        // Recursive computation from the next value
        for (var i=1; i < stockData.length; i++) {
            EMA[i] = alpha*stockData[i][idx] + (1-alpha)*EMA[i-1];
        }
        return EMA;
    }

    // Function to compute crossover of stock price curve with a computed metric
    function ComputeLatestCrossover(stockData, idx, metricData) {
        // Initialize
        var idxCrossOver = -1; // no cross over
        var priceCrossOver = 0;

        // Check if initially the metric curve is over or below the price curve
        var metricUp = (metricData[0] > stockData[0][idx]) ? true : false;

        // Search for cross over point
        for (var i=0; i < stockData.length; i++) {
            if (metricUp) {
                if (metricData[i] < stockData[i][idx]) {
                    // Cross over occurred
                    idxCrossOver = i;
                    priceCrossOver = stockData[idxCrossOver][idx];
                    metricUp = false;
                    if (debugging) {
                        console.log("Metric curve was up and went down at: ")
                        console.log("idxCrossOver = " + idxCrossOver);
                        console.log("priceCrossOver = " + priceCrossOver);
                        console.log("metricUp = " + metricUp);
                    }
                }
            }
            else {
                if (metricData[i] > stockData[i][idx]) {
                    // Cross over occurred
                    idxCrossOver = i;
                    priceCrossOver = stockData[idxCrossOver][idx];
                    metricUp = true;
                    if (debugging) {
                        console.log("Metric curve was down and went up at:")
                        console.log("idxCrossOver = " + idxCrossOver);
                        console.log("priceCrossOver = " + priceCrossOver);
                        console.log("metricUp = " + metricUp);
                    }
                }
            }
        }

        // For debugging
        if (debugging) {
            console.log("Final crossover at: ")
            console.log("idxCrossOver = " + idxCrossOver);
            console.log("priceCrossOver = " + priceCrossOver);
            console.log("metricUp = " + metricUp);
        }
        return { idx: idxCrossOver, price: priceCrossOver, up: metricUp }

    }

    // Function to compute crossover of the first reference curve with a computed metric
    function ComputeLatestCrossoverOfTwoMetrics(refData, metricData) {
        // Initialize
        var idxCrossOver = -1; // no cross over
        var priceCrossOver = 0;

        // Check if initially the metric curve is over or below the price curve
        var metricUp = (metricData[0] > refData[0]) ? true : false;

        // Search for cross over point
        for (var i=0; i < refData.length; i++) {
            if (metricUp) {
                if (metricData[i] < refData[i]) {
                    // Cross over occurred
                    idxCrossOver = i;
                    priceCrossOver = refData[idxCrossOver];
                    metricUp = false;
                }
            }
            else {
                if (metricData[i] > refData[i]) {
                    // Cross over occurred
                    idxCrossOver = i;
                    priceCrossOver = refData[idxCrossOver];
                    metricUp = true;
                }
            }
        }
        return { idx: idxCrossOver, price: priceCrossOver, up: metricUp }
    }

    // This function finds the minimum value of the stock data over the given number of periods
    function GetMin(stockData, idxLow, idx, numPeriods)
    {
        // Initialize
        var lowValue = stockData[idx][idxLow];
        var N = (idx < numPeriods) ? idx : numPeriods; // Minimum of the number of periods or the actual index

        for (var i=idx, j=0; j < N; i--, j++) {
            var price = stockData[i][idxLow];
            if (price < lowValue) {
                lowValue = price;
            }
        }
        return lowValue;
    }

    // This function finds the maximum value of the stock data over the given number of periods
    function GetMax(stockData, idxHigh, idx, numPeriods)
    {
        // Initialize
        var highValue = stockData[idx][idxHigh];
        var N = (idx < numPeriods) ? idx : numPeriods; // Minimum of the number of periods or the actual index

        for (var i=idx, j=0; j < N; i--, j++) {
            var price = stockData[i][idxHigh];
            if (price > highValue) {
                highValue = price;
            }
        }
        return highValue;
    }

    // Function to compute %K curve of the stochastic oscillator
    function ComputeStochastic_K(stockData, idxLow, idxHigh, idx, numPeriods) {

        // Initialize return variable
        var StochasticK = new Array();

        // Computation from the next value
        for (var i=0; i < stockData.length; i++) {
            var price = stockData[i][idx];
            var H = GetMax(stockData, idxHigh, i, numPeriods);
            var L = GetMin(stockData, idxLow, i, numPeriods);

            console.log("(idx, H, L) : " + i + "," + H + "," + L);
            var denom = H - L;
            if (denom <= 0.0) {
                denom = 1.0;
            }
            StochasticK[i] = 100*((price-L)/(denom));
            console.log("(StochasticK[idx]) : " + StochasticK[i]);
        }
        return StochasticK;
    }

    // Function to compute %D curve fo the stochastic oscillator
    function ComputeStochastic_D(KData, numPeriods)
    {
        // Initialize return variable
        var StochasticD = new Array();

        // Initial value
        StochasticD[0] = KData[0];
        var sum = StochasticD[0];

        // Recursive computation from the next value
        for (var i=1; i < KData.length; i++) {
            if (i < numPeriods) {
                sum += KData[i];
                StochasticD[i] = sum/(i+1);
            }
            else {
                // Drop the oldest value
                sum += KData[i] - KData[i-numPeriods];
                StochasticD[i] = sum/numPeriods;
            }
        }
        return StochasticD;
    }

    // Function to compute %K and %D curves of the stochastic oscillator
    function ComputeStochastic(stockData, idxLow, idxHigh, idx, numPeriods1, numPeriods2) {

        // First compute the %K curve with numPeriods1
        var StochasticK = ComputeStochastic_K(stockData, idxLow, idxHigh, idx, numPeriods1);

        // Now compute %D curve which is the SMA of %K curve using numPeriods2
        var StochasticD = ComputeStochastic_D(StochasticK, numPeriods2);

        return { K: StochasticK, D:StochasticD }
    }


 }); // end doc ready; do not delete this!
