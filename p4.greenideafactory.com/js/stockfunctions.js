$(document).ready(function() { // start doc ready; do not delete this!

    //alert("Inside stockfunctions document");

    var debugging = true;

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
    var gCurrentStockData;
    var gCurrentPriceData;
    var gCurrentPriceLegend;
    var gCurrentPlotData;
    var gCurrentPlotLegend;
    var gLegendArray;

    var useSMA = false;
    var useEMA = false;
    var useStochastic = false;

    var SMAPeriodValid = true;
    var EMAPeriodValid = true;
    var StochasticPeriod1Valid = true;
    var StochasticPeriod2Valid = true;

    // Initialize the form fields
    $('#SMAPeriod').val(SMAPeriod);
    $('#EMAPeriod').val(EMAPeriod);
    $('#StochasticPeriod1').val(StochasticPeriod1);
    $('#StochasticPeriod2').val(StochasticPeriod2);

    // Display information
    /**/
    DisplayInformation("<h2>Welcome to the Stock Trading Signal Wizard!</h2><br>" +
                       "<h3>Steps to follow:</h3><br>" +
                       "<ul>" +
                        "<li> Select the stock</li>" +
                        "<li> Check one or more trading signals </li>" +
                        "<li> Select appropriate time period parameters for the chosen signal(s)</li>" +
                        "<li> Click the 'Compute Trading Signals' button</li>" +
                        "<li> Each signal will provide its buy or sell trading price on the right</li>" +
                        "<li> Good luck and hope you make money trading!</li>" +
                        "</ul>");
    /**/

    // Compute Trading Signals Button Click
    $("#computebutton").click(function() {
        ClearAllResults();

        if (useSMA && SMAPeriodValid) {
            RefreshSMAResults();
        }
        if (useEMA && EMAPeriodValid) {
            RefreshEMAResults();
        }
        if (useStochastic && StochasticPeriod1Valid && StochasticPeriod2Valid) {
            RefreshStochasticResults();
        }
    });

    function ClearAllResults() {
        $('#SMASignal').html('');
        $('#EMASignal').html('');
        $('#StochasticSignal').html('');
        if (SMAPeriodValid && EMAPeriodValid && StochasticPeriod1Valid && StochasticPeriod2Valid) {
            $('#messageWindow').html('');
        }
        if (!useSMA && !useEMA && !useStochastic) {
            DisplayMessage('Please check the checkbox next to at least one trading signal');
        }
        // Reset current plot data
        gCurrentPlotData = Clone2D(gCurrentPriceData);
        gCurrentPlotLegend = Clone1D(gCurrentPriceLegend);
    }

    $("#getstockdata").click(function() {
        $("#StockDataHolder").load("/stocks/getstockdata", function(responseText, statusText, xhr)
            {
                if (statusText == "success") {
                    if (debugging) {
                        //DisplayMessage(responseText);
                    }
                    // Get the stock data as a js array, and legend array.
                    // Also set the global variable
                    var jsArray = new Array();
                    var legendArray = new Array();
                    ConvertToJSArray(responseText, jsArray, legendArray);
                    gCurrentStockData = jsArray;
                    gLegendArray = legendArray;

                    // Extract the closing price of the stock and plot
                    gCurrentPriceData = ExtractClosePrice(jsArray);
                    gCurrentPriceLegend = [gLegendArray[gIdxDate], gLegendArray[gIdxClose]];
                    drawStockChart(gCurrentPriceData, gCurrentPriceLegend);
                }

                if (statusText == "error")
                    alert("Ajax - Error"+xhr.status+":"+xhr.statusText);
            }
        )
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

    $('#StockSymbol').change(function() {
        // Reset any variables
    })

    function ValidatePeriod(period){
        var isValid = true;
        if (isNaN(period)) {
            isValid = false;
            message = "Enter a valid number";
        }
        else if (period <= 1 || period > gCurrentStockData.length) {
            var message = "Enter a valid number between 2 and " + gCurrentStockData.length.toString();
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
        var retVal = ValidatePeriod(SMAPeriod);
        if (!retVal.valid) {
            DisplayMessage(retVal.msg);
            SMAPeriodValid = false;
        }
    });

    function RefreshSMAResults() {
        var stockSMA = ComputeSMA(gCurrentStockData, gIdxClose, SMAPeriod);
        var sigSMA = ComputeLatestCrossover(gCurrentStockData, gIdxClose, stockSMA);
        if (sigSMA.up) {
            // Sell signal
            $('#SMASignal').html("<h3>SMA Signal:</h3><b>Sell at <i>$" + sigSMA.price.toString() + "</i></b>");
        }
        else {
            // Buy signal
            $('#SMASignal').html("<h3>SMA Signal:</h3><b>Buy at <i>$" + sigSMA.price.toString() + "</i></b>");
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
        var retVal = ValidatePeriod(EMAPeriod);
        if (!retVal.valid) {
            DisplayMessage(retVal.msg);
            EMAPeriodValid = false;
        }
    });

    function RefreshEMAResults() {
        console.log("gIdxClose = " + gIdxClose);
        console.log("EMAPeriod = " + EMAPeriod);

        var stockEMA = ComputeEMA(gCurrentStockData, gIdxClose, EMAPeriod);
        var sigEMA = ComputeLatestCrossover(gCurrentStockData, gIdxClose, stockEMA);
        if (sigEMA.up) {
            // Sell signal
            $('#EMASignal').html("<h3>EMA Signal:</h3><b>Sell at <i>$" + sigEMA.price.toString() + "</i></b>");
        }
        else {
            // Buy signal
            $('#EMASignal').html("<h3>EMA Signal:</h3><b>Buy at <i>$" + sigEMA.price.toString() + "</i></b>");
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
        var retVal = ValidatePeriod(StochasticPeriod1);
        if (!retVal.valid) {
            DisplayMessage(retVal.msg);
            StochasticPeriod1Valid = false;
        }
    });

    $('#StochasticPeriod2').change(function() {
        StochasticPeriod2Valid = true;
        StochasticPeriod2 = $(this).val();
        var retVal = ValidatePeriod(StochasticPeriod2);
        if (!retVal.valid) {
            DisplayMessage(retVal.msg);
            StochasticPeriod2Valid = false;
        }
    });

    function RefreshStochasticResults() {
        var stochastic = ComputeStochastic(gCurrentStockData, gIdxLow, gIdxHigh, gIdxClose, StochasticPeriod1, StochasticPeriod2);
        var sigStochastic = ComputeLatestCrossoverOfTwoMetrics(stochastic.K, stochastic.D);
        var price = gCurrentStockData[sigStochastic.idx][gIdxClose];
        if (sigStochastic.up) {
            // Sell signal
            $('#StochasticSignal').html("<h3>Stochastics Signal:</h3><b>Sell at <i>$" + price.toString() + "</i></b>");
        }
        else {
            // Buy signal
            $('#StochasticSignal').html("<h3>Stochastics Signal:</h3><b>Buy at <i>$" + price.toString() + "</i></b>");
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
