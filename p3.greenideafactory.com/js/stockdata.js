$(document).ready(function() { // start doc ready; do not delete this!

    //alert("Inside stockdata document");

    // Global variables
    gIdxDate = 0;
    gIdxOpen = 1;
    gIdxHigh = 2;
    gIdxLow  = 3;
    gIdxClose = 4;
    gIdxVolume = 5;
    gIdxAdjClose = 6;

    // Data for AAPL
    AAPLdata = new Array();
    AAPLdata = [
		/* Date,Open,High,Low,Close,Volume,Adj Close */
		["2012-10-01",671.16,676.75,656.50,659.39,19414100,656.39],
		["2012-10-02",661.81,666.35,650.65,661.31,22428300,658.30],
		["2012-10-03",664.86,671.86,662.63,671.45,15152900,668.40],
		["2012-10-04",671.25,674.25,665.55,666.80,13240200,663.77],
		["2012-10-05",665.20,666.00,651.28,652.59,21214500,649.62],
		["2012-10-08",646.88,647.56,636.11,638.17,22785500,635.27],
		["2012-10-09",638.65,640.49,623.55,635.85,29949900,632.96],
		["2012-10-10",639.74,644.98,637.00,640.91,18227000,638.00],
		["2012-10-11",646.50,647.20,628.10,628.10,19502900,625.24],
		["2012-10-12",629.56,635.38,625.30,629.71,16429100,626.85],
		["2012-10-15",632.35,635.13,623.85,634.76,15446500,631.87],
		["2012-10-16",635.37,650.30,631.00,649.79,19634700,646.84],
		["2012-10-17",648.87,652.79,644.00,644.61,13894200,641.68],
		["2012-10-18",639.59,642.06,630.00,632.64,17022300,629.76],
		["2012-10-19",631.05,631.77,609.62,609.84,26574500,607.07],
		["2012-10-22",612.42,635.38,610.76,634.03,19526100,631.15],
		["2012-10-23",631.00,633.90,611.70,613.36,25255200,610.57],
		["2012-10-24",621.44,626.55,610.64,616.83,19947400,614.03],
		["2012-10-25",620.00,622.00,605.55,609.54,23440200,606.77],
		["2012-10-26",609.43,614.00,591.00,604.00,36372600,601.25],
		["2012-10-31",594.88,601.96,587.70,595.32,18214400,592.61],
		["2012-11-01",598.22,603.00,594.17,596.54,12903500,593.83],
		["2012-11-02",595.89,596.95,574.75,576.80,21406200,574.18],
		["2012-11-05",583.52,587.77,577.60,584.62,18897700,581.96],
		["2012-11-06",590.23,590.74,580.09,582.85,13389900,580.20],
		["2012-11-07",573.84,574.54,555.75,558.00,28344600,558.00],
		["2012-11-08",560.63,562.23,535.29,537.75,37719500,537.75],
		["2012-11-09",540.42,554.88,533.72,547.06,33211200,547.06],
		["2012-11-12",554.15,554.50,538.65,542.83,18421500,542.83],
		["2012-11-13",538.91,550.48,536.36,542.90,19033900,542.90],
		["2012-11-14",545.50,547.45,536.18,536.88,17041800,536.88],
		["2012-11-15",537.53,539.50,522.62,525.62,28211100,525.62],
		["2012-11-16",525.20,530.00,505.75,527.68,45246200,527.68],
		["2012-11-19",540.71,567.50,539.88,565.73,29404200,565.73],
		["2012-11-20",571.91,571.95,554.58,560.91,22955500,560.91],
		["2012-11-21",564.25,567.37,556.60,561.70,13321500,561.70],
		["2012-11-23",567.17,572.00,562.60,571.50,9743800,571.50]
    ];

	// Data for GOOG
	GOOGdata = new Array();
	GOOGdata = [
		/* Date,Open,High,Low,Close,Volume,Adj Close */
		["2012-10-01",759.05,765.00,756.21,761.78,3168000,761.78],
		["2012-10-02",765.20,765.99,750.27,756.99,2790200,756.99],
		["2012-10-03",755.72,763.92,752.20,762.50,2208300,762.50],
		["2012-10-04",762.75,769.89,759.40,768.05,2454200,768.05],
		["2012-10-05",770.71,774.38,765.01,767.65,2735900,767.65],
		["2012-10-08",761.00,763.58,754.15,757.84,1958600,757.84],
		["2012-10-09",759.67,761.32,742.53,744.09,3003200,744.09],
		["2012-10-10",741.86,747.53,738.29,744.56,2039900,744.56],
		["2012-10-11",752.90,758.50,750.29,751.48,2383900,751.48],
		["2012-10-12",751.85,754.87,744.10,744.75,2404200,744.75],
		["2012-10-15",741.94,743.83,730.70,740.98,3019100,740.98],
		["2012-10-16",740.13,746.99,736.46,744.70,2058200,744.70],
		["2012-10-17",743.95,756.34,740.26,755.49,2292900,755.49],
		["2012-10-18",755.54,759.42,676.00,695.00,12430200,695.00],
		["2012-10-19",705.58,706.70,672.00,681.79,11482200,681.79],
		["2012-10-22",681.01,684.63,669.70,678.67,4055600,678.67],
		["2012-10-23",672.01,687.33,672.00,680.35,2916600,680.35],
		["2012-10-24",686.80,687.00,675.27,677.30,2496500,677.30],
		["2012-10-25",680.00,682.00,673.51,677.76,2401100,677.76],
		["2012-10-26",676.50,683.03,671.20,675.15,1950800,675.15],
		["2012-10-31",679.86,681.00,675.00,680.30,1537000,680.30],
		["2012-11-01",679.50,690.90,678.72,687.59,2050100,687.59],
		["2012-11-02",694.79,695.55,687.37,687.92,2324400,687.92],
		["2012-11-05",684.50,686.86,675.56,682.96,1635900,682.96],
		["2012-11-06",685.48,686.50,677.55,681.72,1582800,681.72],
		["2012-11-07",675.00,678.23,666.49,667.12,2232300,667.12],
		["2012-11-08",670.20,671.49,651.23,652.29,2597000,652.29],
		["2012-11-09",654.65,668.34,650.30,663.03,3114100,663.03],
		["2012-11-12",663.75,669.80,660.87,665.90,1405900,665.90],
		["2012-11-13",663.00,667.60,658.23,659.05,1594200,659.05],
		["2012-11-14",660.66,662.18,650.50,652.55,1668400,652.55],
		["2012-11-15",650.00,660.00,643.90,647.26,1848900,647.26],
		["2012-11-16",645.99,653.02,636.00,647.18,3438200,647.18],
		["2012-11-19",655.70,668.92,655.53,668.21,2368200,668.21],
		["2012-11-20",669.51,678.00,664.57,669.97,2088700,669.97],
		["2012-11-21",668.99,669.80,660.40,665.87,2112200,665.87],
		["2012-11-23",669.97,670.00,666.10,667.97,922500,667.97]
	];

	// Data for MSFT
	MSFTdata = new Array();
	MSFTdata = [
		/* Date,Open,High,Low,Close,Volume,Adj Close */
		["2012-10-01",29.81,29.98,29.42,29.49,54042700,29.25],
		["2012-10-02",29.68,29.89,29.50,29.66,43338900,29.42],
		["2012-10-03",29.75,29.99,29.67,29.86,46655900,29.62],
		["2012-10-04",29.97,30.03,29.57,30.03,43634900,29.79],
		["2012-10-05",30.23,30.25,29.74,29.85,41133900,29.61],
		["2012-10-08",29.64,29.92,29.55,29.78,29752000,29.54],
		["2012-10-09",29.68,29.74,29.18,29.28,45121100,29.04],
		["2012-10-10",29.15,29.31,28.95,28.98,47227100,28.74],
		["2012-10-11",29.22,29.25,28.87,28.95,41488500,28.71],
		["2012-10-12",28.97,29.32,28.80,29.20,46464700,28.96],
		["2012-10-15",29.37,29.72,29.25,29.51,42440200,29.27],
		["2012-10-16",29.45,29.74,29.32,29.49,47739400,29.25],
		["2012-10-17",29.30,29.64,29.09,29.59,44206100,29.35],
		["2012-10-18",29.65,29.73,29.26,29.50,59238500,29.26],
		["2012-10-19",29.05,29.08,28.50,28.64,90470800,28.41],
		["2012-10-22",28.73,28.83,27.83,28.00,83374000,27.77],
		["2012-10-23",27.77,28.20,27.76,28.05,64414800,27.82],
		["2012-10-24",28.16,28.20,27.87,27.90,53320400,27.67],
		["2012-10-25",28.19,28.20,27.86,27.88,54084300,27.65],
		["2012-10-26",27.86,28.34,27.84,28.21,57790000,27.98],
		["2012-10-31",28.55,28.88,28.50,28.54,69464100,28.31],
		["2012-11-01",28.84,29.56,28.82,29.52,72047900,29.28],
		["2012-11-02",29.59,29.77,29.33,29.50,57131600,29.26],
		["2012-11-05",29.62,29.74,29.33,29.63,38070800,29.39],
		["2012-11-06",29.82,30.20,29.61,29.86,43401500,29.62],
		["2012-11-07",29.53,29.83,29.05,29.08,57871800,28.84],
		["2012-11-08",29.12,29.37,28.80,28.81,49841800,28.58],
		["2012-11-09",28.88,29.19,28.81,28.83,43291200,28.60],
		["2012-11-12",28.94,29.01,28.21,28.22,61112300,27.99],
		["2012-11-13",27.02,27.30,26.75,27.09,131689200,27.09],
		["2012-11-14",27.24,27.29,26.80,26.84,76086100,26.84],
		["2012-11-15",26.88,26.97,26.63,26.66,50955600,26.66],
		["2012-11-16",26.67,26.70,26.34,26.52,64083300,26.52],
		["2012-11-19",26.80,26.80,26.47,26.73,57179300,26.73],
		["2012-11-20",26.76,26.80,26.46,26.71,47070400,26.71],
		["2012-11-21",26.71,27.17,26.67,26.95,66360300,26.95],
		["2012-11-23",27.23,27.77,27.20,27.70,57845700,27.70]
	];


	// Data for AMZN
	AMZNdata = new Array();
	AMZNdata = [
		/* Date,Open,High,Low,Close,Volume,Adj Close */
		["2012-10-01",255.40,256.16,250.49,252.01,2581200,252.01],
		["2012-10-02",252.80,253.15,249.03,250.60,2195800,250.60],
		["2012-10-03",251.21,256.10,249.56,255.92,2745600,255.92],
		["2012-10-04",256.01,261.52,255.87,260.47,2700400,260.47],
		["2012-10-05",261.20,261.90,257.49,258.51,2806500,258.51],
		["2012-10-08",257.67,259.80,255.56,259.06,1762300,259.06],
		["2012-10-09",258.67,259.35,250.73,250.96,3494800,250.96],
		["2012-10-10",252.00,252.46,244.01,244.99,3948300,244.99],
		["2012-10-11",248.00,249.30,241.89,244.22,3447300,244.22],
		["2012-10-12",243.18,245.46,241.91,242.36,2203200,242.36],
		["2012-10-15",242.85,244.78,238.51,244.18,2959800,244.18],
		["2012-10-16",244.87,245.77,242.08,243.94,2204100,243.94],
		["2012-10-17",243.37,248.80,243.30,247.49,3302700,247.49],
		["2012-10-18",247.77,250.91,242.70,244.85,5305300,244.85],
		["2012-10-19",245.16,246.82,238.94,240.00,4395300,240.00],
		["2012-10-22",238.81,238.95,232.32,233.78,4500000,233.78],
		["2012-10-23",231.05,236.50,230.01,234.31,4430800,234.31],
		["2012-10-24",235.88,235.94,227.95,228.49,3678700,228.49],
		["2012-10-25",230.92,230.92,222.92,222.92,6722800,222.92],
		["2012-10-26",228.60,238.71,226.69,238.24,11352900,238.24],
		["2012-10-31",236.32,238.70,230.50,232.89,4797600,232.89],
		["2012-11-01",234.23,234.55,231.34,232.14,3905100,232.14],
		["2012-11-02",234.01,237.40,232.11,232.42,3374700,232.42],
		["2012-11-05",232.04,234.83,230.11,234.33,1846100,234.33],
		["2012-11-06",235.41,237.75,234.45,237.56,2661300,237.56],
		["2012-11-07",235.65,235.66,229.42,232.06,3624200,232.06],
		["2012-11-08",232.22,233.45,227.10,227.35,2982400,227.35],
		["2012-11-09",226.26,230.97,224.60,226.31,3092500,226.31],
		["2012-11-12",226.59,229.22,225.41,226.47,2128800,226.47],
		["2012-11-13",225.12,227.90,224.71,226.60,2629800,226.60],
		["2012-11-14",226.50,227.41,222.51,222.95,3034100,222.95],
		["2012-11-15",222.30,225.16,218.18,220.60,3404700,220.60],
		["2012-11-16",221.31,226.25,218.64,225.23,4352800,225.23],
		["2012-11-19",228.32,232.50,227.45,229.71,3591200,229.71],
		["2012-11-20",230.00,233.82,229.50,233.78,2771700,233.78],
		["2012-11-21",233.84,238.67,232.75,238.03,2959300,238.03],
		["2012-11-23",239.89,240.00,236.48,239.88,1776800,239.88]
	];

}); // end doc ready; do not delete this!