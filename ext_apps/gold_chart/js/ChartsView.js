function ChartsView() {
    this.id;

    var todayChart;
    var lastDaysChart;
    var historyChart;
    var gldSlvChart;
    var gldPltChart;
    var chartMyStack;
    var div;
    
    var todayChartDiv;
    var lastDaysChartDiv;
    var historyChartDiv;
    var gldSlvChartDiv;
    var gldPltChartDiv;
    var chartMyStackToday;
    var chartMyStackLastDays;

    var charts = [];
    
    var selectedChartId;
    
    var isFirstUpdate = true;
    var isSecUp = true;

    this.init = function(parent){
        div = $('<div id="chartsView" class="charts"></div>');
        div.appendTo(parent);

        todayChartDiv = div.append('<div id="todayChart" class="chart">todayChart</div>');
		lastDaysChartDiv = div.append('<div id="lastDaysChart" class="chart">lastDaysChart</div>');
        historyChartDiv = div.append('<div id="historyChart" class="chart">historyChart</div>')
        
		gldSlvTodayChartDiv = div.append('<div id="gldslvTodayChart" class="chart">gldSlvChart</div>');
		gldSlvLastDaysChartDiv = div.append('<div id="gldslvLastDaysChart" class="chart">gldSlvChart</div>');
        gldPltTodayChartDiv = div.append('<div id="gldpltTodayChart" class="chart">gldPltChart</div>');
        gldPltLastDaysChartDiv = div.append('<div id="gldpltLastDaysChart" class="chart">gldPltChart</div>');
        
        chartMyStackToday = div.append('<div id="stackChartToday" class="chart">chartMyStackChart</div>');
        chartMyStackLastDays = div.append('<div id="stackChartLastDays" class="chart">chartMyStackChart</div>');

        todayChart = new GoldpriceChart();
        todayChart.id = 0;
        todayChart.init("todayChart");
        todayChart.start();

        lastDaysChart = new GoldpriceChart();
        lastDaysChart.id = 1;
        lastDaysChart.init("lastDaysChart");
        lastDaysChart.start();

        historyChart = new GoldpriceChart();
        historyChart.id = 2;
        historyChart.init("historyChart");
        historyChart.start();

        gldSlvTodayChart = new GoldpriceChart();
        gldSlvTodayChart.id = 3;
        gldSlvTodayChart.init("gldpltTodayChart");
        gldSlvTodayChart.start();
        
        gldSlvLastDaysChart = new GoldpriceChart();
        gldSlvLastDaysChart.id = 4;
        gldSlvLastDaysChart.init("gldslvLastDaysChart");
        gldSlvLastDaysChart.start();

        gldPltTodayChart = new GoldpriceChart();
        gldPltTodayChart.id = 5;
        gldPltTodayChart.init("gldpltTodayChart");
        gldPltTodayChart.start();
        
        gldPltLastDaysChart = new GoldpriceChart();
        gldPltLastDaysChart.id = 6;
        gldPltLastDaysChart.init("gldpltLastDaysChart");
        gldPltLastDaysChart.start();
        
        chartMyStackToday = new GoldpriceChart();
        chartMyStackToday.id = 7;
        chartMyStackToday.init("stackChartToday");
        chartMyStackToday.start();
        
        chartMyStackLastDays = new GoldpriceChart();
        chartMyStackLastDays.id = 8;
        chartMyStackLastDays.init("stackChartLastDays");
        chartMyStackLastDays.start();

        charts = [todayChart,lastDaysChart,historyChart,
        			gldSlvTodayChart,gldSlvLastDaysChart,
        			gldPltTodayChart,gldPltLastDaysChart,
        			chartMyStackToday,chartMyStackLastDays];

        selectChart(todayChart);
    }

    this.updateData = function(seriesData,gldSlvRatioData, gldPltRatioData,chartMyStackData, mode)
    {
    	// Sprawdzenie, czy szerokosc wartosci na osi Y sie zmiejszyła
    	// jezeli tak to wykres jest inicjowany na nowo
    	// ze wzgledu na blad wyswietlania osi w takim przypadku
    	// todayChart
    	
    	if( mode == undefined ) { mode = 3 };
    	mode = 3;
    	
    	if( mode == 1 || mode == 3 )
    	{
	    	resetChart(todayChart,$("#todayChart"),"todayChart");
	    	var updated = todayChart.setSeriesData(seriesData[0],isFirstUpdate);
	    	if( updated )
	    	{
	    		if( isSecUp )
	    		{
	    			isSecUp = false;
	    		}
	    		else
	    		{
	    			//isFirstUpdate = false;
	    		}
	    		isFirstUpdate = false;
	    	}
	    	/*setTimeout( function(){
	    		isFirstUpdate = false;
	    	},5000);*/
		}
		
		if( mode == 2 || mode == 3)	   
    	{
	    	resetChart(lastDaysChart,$("#lastDaysChart"),"lastDaysChart");
			lastDaysChart.setSeriesData(seriesData[1]);
	
	    	resetChart(historyChart,$("#historyChart"),"historyChart");
			historyChart.setSeriesData(seriesData[2]);	
			
			resetChart(chartMyStackToday,$("#stackChartToday"),"stackChartToday");
	    	resetChart(chartMyStackLastDays,$("#stackChartLastDays"),"stackChartLastDays");
	    	
	    	chartMyStackToday.setSeriesData(chartMyStackData[0]);    
			chartMyStackLastDays.setSeriesData(chartMyStackData[1]);
	    	
	    	resetChart(gldSlvTodayChart,$("#gldslvTodayChart"),"gldslvTodayChart");
	        gldSlvTodayChart.setSeriesData(gldSlvRatioData[0],isFirstUpdate);
	        
	        resetChart(gldSlvLastDaysChart,$("#gldslvLastDaysChart"),"gldslvLastDaysChart");
	        gldSlvLastDaysChart.setSeriesData(gldSlvRatioData[1]);
	        
	        resetChart(gldPltTodayChart,$("#gldpltTodayChart"),"gldpltTodayChart");
	        gldPltTodayChart.setSeriesData(gldPltRatioData[0],isFirstUpdate);
	        
	        resetChart(gldPltLastDaysChart,$("#gldpltLastDaysChart"),"gldpltLastDaysChart");
	        gldPltLastDaysChart.setSeriesData(gldPltRatioData[1]);    	
    	}

        this.selectChartById(selectedChartId);
    }
    
    checkIfResetChart = function(chart,data){
    	var lastVal = chart.getYlabelWidth();
    	var nextVal = chart.calculateYlabelWidth(data);
    	
    	if( nextVal < lastVal ){
    		return true;
    	}else{
    		return false;
    	}
    }
    
    resetChart = function (chart, chartDiv,divId){
    	var dateWindowOpt = chart.getOpt();
	    	chartDiv.replaceWith('<div id="'+divId+'" class="chart">todayChart</div>');
	        chart.init(divId);
	        chart.start(dateWindowOpt);  
    }

    this.selectChartById = function(id)
    {
    	selectedChartId = id;
        var chart = getChartById(id);
        if( chart )
        {
            selectChart(chart);
        }
    }
    

    selectChart = function(selectedChart){
        for( var i = 0; i < charts.length; i++)
        {
            var chart = charts[i]  ;
            if( chart == selectedChart ){
                chart.show();
            }
            else
            {
                chart.hide();
            }
        }
    }

    getChartById = function(id){
        for( var i = 0; i < charts.length; i++)
        {
            var chart = charts[i]  ;
            if( chart.id == id ){
              return chart;
            }
        }
        return null;
    }
}
