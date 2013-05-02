var AppModel = (function(){
    var Constructor = function() {
        this.data = 'some data';

        var goldData = [];
        var silverData = [];
        var platiniumData = [];
        var palladiumData = [];
        
        var ratioData = [];
        var gldSlvRatioData = [];
        var gldPltRatioData = [];
        var chartMyStackData = [];
        
		var goldStackcVal= 1;
        var silverStackVal = 1;
        var platiniumStackVal = 1;
        var palladiumStackVal = 1;
        
        var numSeries = 0;
        var refreshCallback ;
        var initCallback ;
        var remainingTimeCallback ;
        var lastTime;
        var currencyDataList = [];
        var remainingTime = 0;

        var isFirstRun = true;
        var ws;
        var weekend;
        var CLine;
        var days;
        var numbers;
        var selectedCurrency;
        var currencyList = [];
        var historyList = [];
        var selectedUnit = 0;
        var currentApiMethod;
        
        this.getGoldData = function(){ return goldData };
        this.getSilverData = function(){ return silverData };
        this.getPlatiniumData = function(){ return platiniumData };
        this.getPalladiumData = function(){ return palladiumData };
        this.getRatioData = function(){ return ratioData };
        this.getGldSlvRatioData = function(){ return gldSlvRatioData };
        this.getGldPltRatioData = function(){ return gldPltRatioData };
        this.getChartMyStackData = function(){ return chartMyStackData };

        this.getNumSeries = function(){ return numSeries};
        this.getCurrencyItems  = function(){ return currencyList};
        this.getSelectedUnit  = function(){ return selectedUnit};
        this.getSelectedCurrency  = function(){ return selectedCurrency};
        
        this.connect = function()
        {

            var Socket = "MozWebSocket" in window ? MozWebSocket : WebSocket;
           	ws= new Socket("ws://goldpricecafe.com:8080/foo/bar?hello=world");

             //evt.data przy starcie zwraca wszystkie dane startowe z serwera -- plik data2.csv z zalacznika z mejla. Nastepnie co 2 minuty bedzie wysylac aktualizacje danych do wykresu -- plik latest_data.csv z zalacznika z mejla (docelowo tylko data2.csv bedzie wysylany zzipowany, ale to dopiero dla drugiej iteracji)
            ws.onmessage = function(evt) {
                var csv;
				if( currentApiMethod == "history")
                {
                	var historyCsv = parseCSV(evt.data);
                	updateHistory(historyCsv);
                	currentApiMethod ="";
                    
                    refreshCallback();
                }
                else if( currentApiMethod == "time")
                {
                    updateRemainingTime(evt.data);
                    currentApiMethod = "";
                    refreshCallback(2);
                }
                else if( isFirstRun)
                {
                    isFirstRun = false;
                    csv = parseCSV(evt.data);
                    
                    onInitData(csv);

                    currentApiMethod = "time";
                    ws.send('time');
                }
                else
                {
                    remainingTime = 120;
                    csv = parseCSV(evt.data);
                    
                    
                    var i = 0;
                    for ( var key in currencyDataList)
                    {
                        var updatedRow = csv[i];
                        var time = updatedRow[0];
                        var currencyData = currencyDataList[key];
                        var indx = getRowIndxByTime(currencyData,time) ;
                        if( indx > -1 )
                        {
                            currencyData[indx] = updatedRow;
                        }
                        i++;
                    }

                    updateData();

                    refreshCallback();

                    remainingTimeCallback(remainingTime);
                }
            };

            ws.onclose = function(event) {
                console.log("Closed - code: " + event.code + ", reason: " + event.reason + ", wasClean: " + event.wasClean);
            };

            ws.onopen = function() {

            };
        }
        
        this.getHistoryData = function()
        {
        	if( historyList["USD"] == undefined )
        	{
        	 	currentApiMethod ="history";
        		ws.send('history');
        		return true;
        	}
        	else
        	{
        		return false;
        	}
        }

        this.chartMyStack = function(data){
            goldStackcVal = data.gold;
            silverStackVal = data.silver;
            platiniumStackVal = data.platinium;
            palladiumStackVal = data.palladium;
            updateData();
            refreshCallback();
        }

        this.changeCurrency = function (currencyName)
        {
            if( selectedCurrency != currencyName)
            {
                selectedCurrency = currencyName;
                updateData();
                refreshCallback();
            }
        }

        this.selectUnit = function (id)
        {
            // 0 - oz, 1- gr
            selectedUnit = id;
            updateData();
            refreshCallback();
        }

        this.getSelectedUnitName = function(){
            if( selectedUnit == 0 ){
                return "oz"
            }else{
                return "gr";
            }
        }
        
        this.isWeekend = function(){
        	return weekend == "weekend";
        }

        getRowIndxByTime = function(data,time)
        {
             for ( var i = 0; i < data.length; i++)
             {
                 var row = data[i];
                 if( row[0] == time)
                 {
                     return i;
                 }
             }
            return -1;
        }

        onInitData = function(csv)
        {
            weekend = csv.pop();
            CLine = csv.pop();
            days = [ csv.pop().toString(), csv.pop().toString(), csv.pop().toString()];
            numbers = csv.pop();

            currencyDataList=  parseCurrency(csv,currencyDataList);

            selectedCurrency = "USD";

            updateData();

            initCallback();
        }

        updateRemainingTime = function(o){
            var data = o;
            var parts = data.split(":");

            var sec = parts[1];
            var min = parts[0];
            var remain = 64 - Number(sec);
            //jeze minuty sa parzyste to dodajemy dodatkowe 60sek
            if(min%2==0)
            {
                 remain = remain + 60;
            }

            remainingTime = remain;
            
            remainingTimeCallback(remain);
        }
        
        updateHistory = function(historyCsv){
        	historyList = parseCurrency(historyCsv);
        	
        	updateData();
        }

        updateData = function()
        {
            var data = currencyDataList[selectedCurrency];

            var gldslvData = currencyDataList["gldslv"];
            var gldpltData = currencyDataList["gldplt"];
            var gldpldData = currencyDataList["gldpld"];

            var csvToday = "time,today,yesterday,"+data[2];
            var csvLastDays = "time,today";

            var today = [];
            var lastDays = [];
            var history = [];

            goldData[0] = getChartData(data,null,"today",1);
            goldData[1] = getChartData(data,null,"lastDays",1);
            if(historyList["USD"] != undefined )
            {
            	var hdata = historyList[selectedCurrency];
            	goldData[2] = getChartData(hdata,null,"history",1);
            }
            
            silverData[0] = getChartData(data,gldslvData,"today",1) ;
            silverData[1] = getChartData(data,gldslvData,"lastDays",1) ;

            platiniumData[0] = getChartData(data,gldpltData,"today",1) ;
            platiniumData[1] = getChartData(data,gldpltData,"lastDays",1) ;

            palladiumData[0] = getChartData(data,gldpldData,"today",1) ;
            palladiumData[1] = getChartData(data,gldpldData,"lastDays",1) ;

            //ratioData[0] = getChartData(gldslvData,null,"today",1) ;
            //ratioData[1] = getChartData(gldpltData,null,"today",1) ;
            
            gldSlvRatioData[0] = getChartData(gldslvData,null,"today",1, false) ;
            gldSlvRatioData[1] = getChartData(gldslvData,null,"lastDays",1, false) ;
            
            gldPltRatioData[0] = getChartData(gldpltData,null,"today",1, false) ;
            gldPltRatioData[1] = getChartData(gldpltData,null,"lastDays",1, false) ;

            goldData[0].current = getCurrentValue(goldData[0].rows).result;
            silverData[0].current = getCurrentValue(silverData[0].rows).result;
            platiniumData[0].current = getCurrentValue(platiniumData[0].rows).result;
            palladiumData[0].current = getCurrentValue(palladiumData[0].rows).result;
            
            goldData[0].currentTime = getCurrentValue(goldData[0].rows).time;
            silverData[0].currentTime = getCurrentValue(silverData[0].rows).time;
            platiniumData[0].currentTime = getCurrentValue(platiniumData[0].rows).time;
            palladiumData[0].currentTime = getCurrentValue(palladiumData[0].rows).time;
            
            chartMyStackData[0] = getChartMyStackData(
            						goldData[0].rows,silverData[0].rows,platiniumData[0].rows,palladiumData[0].rows,
            						goldStackcVal,silverStackVal,platiniumStackVal,palladiumStackVal,
            						"today"
            						);
            						
            chartMyStackData[1] = getChartMyStackData(
            						goldData[1].rows,silverData[1].rows,platiniumData[1].rows,palladiumData[1].rows,
            						goldStackcVal,silverStackVal,platiniumStackVal,palladiumStackVal,
            						"lastDays"
            						);
            						
            currencyList =  getCurrencyList();
        }
        
        getChartMyStackData = function(d1,d2,d3,d4,s1,s2,s3,s4, type)
        {
            var result= {
                rows: [],
                labels: [],
                visibility: []
            }; 
            
			for ( var i = 0; i < d1.length; i++)
            { 
            	var chartRow = [];
            	
            	var time = d1[i][0];
            	
            	var today = d1[i][1] * s1 + 
            				d2[i][1] * s2 + 
            				d3[i][1] * s3 + 
            				d4[i][1] * s4;
            				
            		today = Math.round(today*100)/100;
            				
            	var yesterday; 
            	var lastDay; 
            	var none;
            	
            	chartRow.push(time);
            	chartRow.push( today );
            	
            	if( type == "today")
            	{
            		none = d1[i][2];
            	}
            	else if( type == "lastDays")
            	{
            		yesterday = d1[i][2] * s1 + 
            					d2[i][2] * s2+ 
            					d3[i][2] * s3 + 
            					d4[i][2] * s4;
            		yesterday = Math.round(yesterday*100)/100;
            					
            		lastDays = 	d1[i][3] * s1+ 
            					d2[i][3] * s2+ 
            					d3[i][3] * s3+ 
            					d4[i][3] * s4;
            		lastDays = Math.round(lastDays*100)/100;
            					
            		none = d1[i][4];
            		
            		if( isNaN(yesterday) ) yesterday = null;
            		if( isNaN(lastDays) ) lastDays = null;
            		chartRow.push( yesterday );
            		chartRow.push( lastDays );
            	}
            	
            	if( isNaN(today) ) today = null;
            	
            	chartRow.push(none);
            	
            	result.rows.push(chartRow);
            } 
 			if( type == "today")
            {
                result.visibility = [true,false];
                result.labels = ["time","today","none"];
                result.colors = ["#EFB839"];
            }
            else if( type == "lastDays")
            {
                result.visibility = [true,true,true,false];
                result.labels = ["time",days[2],"yesterday","today","none"];
            }  
            
             return result;  
        }

        getCurrentValue = function (data)
        {
            var result = 0;
            var time = 0;
            var d = { result: 0, time: 0};
			for ( var i = data.length-1; i > 0; i--)
            {
                var row = data[i];
                if( row[1] != null && row[1] != undefined && !isNaN(row[1]))
                {
               		result = row[1];
               		time = row[0];
               		d = { result: result, time: time };
               		
                    return d;
                }
            }
            return d;
        }

        getCurrencyList = function()
        {
            var list = [];
            for ( var key in currencyDataList)
            {
                if( key != "gldslv" && key != "gldplt" && key != "gldpld" )
                {
                    list.push({label:key, data:key});
                }
            }
            return list;
        }
        
        getChartData = function(data,ratioData,type,stackMultiply, useUnit)
        {
            var result= {
                rows: [],
                labels: [],
                visibility: []
            };
            
            if( useUnit == undefined || useUnit == null ){
            	useUnit = true;
            }
            
            for ( var i = 0; i < data.length; i++)
            {
                var row = data[i];
                var time = getTimeFormCSV(row[0]);
                if( type == "history" ){
                	time = getHistoryTimeFromCSV(row[0]);
                }

                var chartRow = [];
                chartRow.push(time);
                
                if( type == "today")
                {
                    chartRow.push( getValue( row[1], getRatio(i,ratioData,1),stackMultiply, useUnit ) );
                }else if( type == "history"){
                	chartRow.push( getValue( row[1], getRatio(i,ratioData,1),1, useUnit ) );
                }else if( type =="lastDays")
                {
                    chartRow.push( getValue( row[3], getRatio(i,ratioData,3),stackMultiply, useUnit) );
                    chartRow.push( getValue( row[2], getRatio(i,ratioData,2),stackMultiply, useUnit ) );
                    chartRow.push( getValue( row[1], getRatio(i,ratioData,1),stackMultiply, useUnit ) );
                }

				if( type != "history"){
	                if( i == 0 ) {
	                    chartRow.push(getTimeFormCSV("00:00"));
	                } else if( i == data.length-1){
	                    chartRow.push(getTimeFormCSV("23:59"));
	                }else{
	                    chartRow.push(null);
	                }
                }
                result.rows.push(chartRow)
            }

            if( type == "today")
            {
                result.visibility = [true,false];
                result.labels = ["time","today","none"];
                result.colors = ["#EFB839"];
            }
            else if( type == "lastDays")
            {
                result.visibility = [true,true,true,false];
                result.labels = ["time",days[2],"yesterday","today","none"];
            }else if( type == "history" ){
                result.visibility = [true];
                result.labels = ["time","history"]; 
                result.colors = ["#EFB839"];          
            }

            return result;
        }

        getValue = function (val, ratio,stackMultiply, useUnit)
        {
            val = getValid(val);
            var result;
            if( useUnit )
            {
             	result = val / ratio / getUnitRatio() * stackMultiply;
            }
            else
            {
            	result = val / ratio * stackMultiply;
            }
            return Math.round(result*100)/100;
        }

        getUnitRatio = function()
        {
            if( selectedUnit == 0 )
            {
                return 1;
            }
            else
            {
                return 31.1034768;
            }
        }

        getRatio = function(rowId, ratioData, colId)  {
            var ratio = 1;
            var ratioRow;
            if( ratioData != undefined && ratioData != null)
            {
                ratioRow = ratioData[rowId];
                ratio = ratioRow[colId];
            }
            if( ratio == "") ratio = 1;
            return ratio;
        }

        getValid = function( val )
        {
            if( val == "") return null;
          //  if( isNaN(val)) return null;
            return val;
        }

        parseCurrency = function(csv)
        {
            var list = [];
            var currency;
            for( var i =0; i < csv.length; i++)
            {
                var row = csv[i]
                if(row.length == 1)
                {
                    currency = row[0];
                    list[currency] = [];
                }
                else
                {
                    list[currency].push(row);
                }
            }
            return list;
        }

        this.update = function update()
        {
            goldData[0] = [];
            addTestSeries( goldData[0], "today");
            addRangeSeries(goldData[0]);

            //today
            silverData[0] = [];
            addTestSeries( silverData[0], "today");
            addRangeSeries(silverData[0]);

            //lastDays
            silverData[1] = [];
            addTestSeries( silverData[1], "today");
            addTestSeries( silverData[1], "lastDays");
            addTestSeries( silverData[1], "history");
            addRangeSeries(silverData[1]);

            //history
            silverData[2] = [];
            addTestSeries( silverData[2], "today");
            addRangeSeries(silverData[2]);


            /////////////////////////////////////
            // PLATINIUM DATA
            /////////////////////////////////////
            //today
            platiniumData[0] = [];
            addTestSeries( platiniumData[0], "today");
            addRangeSeries(platiniumData[0]);

            //lastDays
            platiniumData[1] = [];
            addTestSeries( platiniumData[1], "today");
            addTestSeries( platiniumData[1], "lastDays");
            addTestSeries( platiniumData[1], "history");
            addRangeSeries(platiniumData[1]);

            //history
            platiniumData[2] = [];
            addTestSeries( platiniumData[2], "today");
            addRangeSeries(platiniumData[2]);


            /////////////////////////////////////
            // PLATINIUM DATA
            /////////////////////////////////////
            //today
            palladiumData[0] = [];
            addTestSeries( palladiumData[0], "today");
            addRangeSeries(palladiumData[0]);

            //lastDays
            palladiumData[1] = [];
            addTestSeries( palladiumData[1], "today");
            addTestSeries( palladiumData[1], "lastDays");
            addTestSeries( palladiumData[1], "history");
            addRangeSeries(palladiumData[1])

            //history
            palladiumData[2] = [];
            addTestSeries( palladiumData[2], "today");
            addRangeSeries(palladiumData[2]) ;

            setInterval(refreshPoints,5000);
        }

        this.setRefreshCallback = function(func)
        {
            refreshCallback = func;
        }

        this.setInitCallback = function(func)
        {
            initCallback = func;
        }

        this.setRemainingTimeCallback = function(func)
        {
            remainingTimeCallback = func;
        }

        this.setRemainingTime = function(time)
        {
            remainingTime = time;
        }

        this.getRemainingTime = function(){
            return remainingTime;
        }

        refreshPoints = function()
        {
            lastTime.setMinutes(lastTime.getMinutes()+2);
            time = getDyglaphsDate(lastTime) ;

            addPoint(goldData[0],"today",time,getRandValue());
            addPoint(goldData[1],"today",time,getRandValue());
            addPoint(goldData[1],"lastDays",time,getRandValue());
            addPoint(goldData[1],"history",time,getRandValue());
            addPoint(goldData[2],"today",time,getRandValue());
            addRangeSeries(goldData[2]) ;

            addPoint(silverData[0],"today",time,getRandValue());
            addPoint(silverData[1],"today",time,getRandValue());
            addPoint(silverData[1],"lastDays",time,getRandValue());
            addPoint(silverData[1],"history",time,getRandValue());
            addPoint(silverData[2],"today",time,getRandValue());

            addPoint(platiniumData[0],"today",time,getRandValue());
            addPoint(platiniumData[1],"today",time,getRandValue());
            addPoint(platiniumData[1],"lastDays",time,getRandValue());
            addPoint(platiniumData[1],"history",time,getRandValue());
            addPoint(palladiumData[2],"today",time,getRandValue());

            addPoint(palladiumData[0],"today",time,getRandValue());
            addPoint(palladiumData[1],"today",time,getRandValue());
            addPoint(palladiumData[1],"lastDays",time,getRandValue());
            addPoint(palladiumData[1],"history",time,getRandValue());
            addPoint(palladiumData[2],"today",time,getRandValue());
            refreshCallback.call();
        }

        addRangeSeries = function(seriesData)
        {
            var d = new Date();
            d.setHours(0);
            d.setMinutes(0) ;
            var e = new Date();
            e.setHours(23);
            e.setMinutes(59) ;
            addPoint(seriesData,"none",getDyglaphsDate(d),1);
            addPoint(seriesData,"none",getDyglaphsDate(e),2);
        }

        getDyglaphsDate = function(d)
        {
            return new Date("2012/03/01 "+ d.getHours() +":" + d.getMinutes());
        }
        
        getHistoryTimeFromCSV = function(time)
        {
            var parts = time.split("-");
            var yyyy = "20"+parts[2];
            var mm = parts[1];
            var dd = parts[0];
            
            return new Date(yyyy+"/"+mm+"/"+dd);
        }

        getTimeFormCSV = function(time)
        {
            var parts = time.split(":");
            var hours = parts[0];
            var minutes = parts[1];
            
            return new Date("2012/03/01 "+ hours +":" + minutes);
        }

        addTestSeries = function(seriesData,seriesName)
        {
            for ( var i = 1; i < 10; i++ )
            {
                var d = new Date();
                d.setHours(0)
                d.setMinutes(i*2);
                addPoint(seriesData,seriesName,getDyglaphsDate(d),getRandValue());

                lastTime = getDyglaphsDate(d);
            }
        }

        addPoint = function(seriesData, seriesName,time,value)
        {
            if( seriesData[seriesName] == undefined )
            {
                seriesData[seriesName] = [];
                numSeries++;
            }
            var row = getRowByTime(seriesData,seriesName, time)
            if( row == null )
            {
                seriesData[seriesName].push( { x: time, y: value } );
            }
        }

        getRandValue = function()
        {
            return Math.random() * 1000;
        }

        getRowByTime = function(seriesData,seriesName, time)
        {
            var series = seriesData[seriesName];
            if( series )
            {
                for ( var i = 0; i < series.length; i++)
                {
                    var row = series[i];
                    if( row[0] == time )
                    {
                        return row;
                    }
                }
            }
            return null;
        }

    }
    return {
        getInstance: function (){
            return this.instance || (this.instance = new Constructor);
        }
    }
})();