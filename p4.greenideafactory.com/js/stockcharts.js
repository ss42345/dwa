//$(document).ready(function() { // start doc ready; do not delete this!

    // Load the visualization library from google.
    google.load("visualization", "1", {packages:["corechart"]});
    google.setOnLoadCallback(drawChartSample);

    function drawChartSample() {

        var data = google.visualization.arrayToDataTable([
            ['Date','Price','SMA'],
            ["2012-10-01",659.39, 659.39],
            ["2012-10-02",661.31, 660.35],
            ["2012-10-03",671.45, 664.05],
            ["2012-10-04",666.80, 664.7375],
            ["2012-10-05",652.59, 662.308],
            ["2012-10-08",638.17, 658.285],
            ["2012-10-09",635.85, 655.08],
            ["2012-10-10",640.91, 653.30875],
            ["2012-10-11",628.10, 650.5077778],
            ["2012-10-12",629.71, 648.428],
            ["2012-10-15",634.76, 645.965],
            ["2012-10-16",649.79, 644.813],
            ["2012-10-17",644.61, 642.129],
            ["2012-10-18",632.64, 638.713],
            ["2012-10-19",609.84, 634.438],
            ["2012-10-22",634.03, 634.024],
            ["2012-10-23",613.36, 631.775],
            ["2012-10-24",616.83, 629.367],
            ["2012-10-25",609.54, 627.511],
            ["2012-10-26",604.00, 624.94],
            ["2012-10-31",595.32, 620.996],
            ["2012-11-01",596.54, 615.671],
            ["2012-11-02",576.80, 608.89],
            ["2012-11-05",584.62, 604.088],
            ["2012-11-06",582.85, 601.389],
            ["2012-11-07",558.00, 593.786],
            ["2012-11-08",537.75, 586.225],
            ["2012-11-09",547.06, 579.248],
            ["2012-11-12",542.83, 572.577],
            ["2012-11-13",542.90, 566.467],
            ["2012-11-14",536.88, 560.623],
            ["2012-11-15",525.62, 553.531],
            ["2012-11-16",527.68, 548.619],
            ["2012-11-19",565.73, 546.73],
            ["2012-11-20",560.91, 544.536],
            ["2012-11-21",561.70, 544.906],
            ["2012-11-23",571.50, 548.281]
        ]);
        var options = {
            title: 'Sample Stock Chart'
        };
    }

    function drawStockChart(stockdataIn, legendArrayIn) {
        var dataIn = google.visualization.arrayToDataTable(stockdataIn);
        var stockSymbol = $('#StockSymbol').val();
        var options = {
            title: stockSymbol + ' Stock Chart'
        };

        // Add legend
        for (var j = 0; j < legendArrayIn.length; j++) {
            dataIn.setColumnLabel(j,legendArrayIn[j]);
        }

        // Draw the chart
        var chart = new google.visualization.LineChart(document.getElementById('chartArea'));
        chart.draw(dataIn, options);

    }

//}); // end doc ready; do not delete this!
