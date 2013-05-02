function PanDygraph() {
    this.name = name;

    var seriesData = [];
    var currentData = [];
    var g;
    var highlightedPoints = [];
    var numSeries = 0;
    
    var yLabelWidth = 0;
    var chartName;
    
    var lastYearFormatter;

    this.setSeriesData = function(data,resetDateWindow)
    {
    	console.log("resetDateWindow",resetDateWindow);
    	var updated = false;
   		if( resetDateWindow == undefined ) {resetDateWindow = false};
        if(data!= undefined && data.rows && data.rows.length > 1 )
        {
        	//console.log("setSeriesData",data.rows[0][1]);
        	yLabelWidth = this.calculateYlabelWidth(data);
        	var xAxisLabelWidth = 39;
        	if( chartName == "historyChart" )
        	{
        		xAxisLabelWidth = 80;
        	}
        	
        	if( data.colors == undefined )
        	{
        		data.colors = ["#ead4ba","#fdd98e","#EFB839","#ead4ba"]
        	}
        	var d = data.currentTime;
        	if( d != undefined && d != 0  && resetDateWindow)
        	{
	         	var h = d.getHours();
	         	var h1 = h -2;
	         	if( h1 < 0 ) h1 = 0;
	        	var d1 = new Date(d).setHours(h-2);
	        		//d1 = new Date(d1).setMinutes(0);
	        		
	        	var d2 = new Date(d).setHours(h+1.5);
	        		//d2 = new Date(d2).setMinutes(0);
	        	
	        	var dateWindow = [d1,d2];   
	        	
	        	updated = true;
        	}

        	
            if( g != undefined )
            {
            	var optt = {
                        'file' : data.rows ,
                        'visibility' : data.visibility,
                        'labels' : data.labels,
                        'colors' : data.colors,
                        //,
                        'yAxisLabelWidth' : yLabelWidth,
                        'xAxisLabelWidth' : xAxisLabelWidth
                        //'yLabelWidth ' : 10            	
            	};
            	if(dateWindow != undefined )
            	{
            		optt.dateWindow = dateWindow;
            	}
                g.updateOptions(
                	optt
                );
               // g.resize();
               // setTimeout(g.resize,100);
            }
            return updated;
        }
    }
    
    this.getYlabelWidth = function(){
    	return yLabelWidth;
    }
    
    this.calculateYlabelWidth = function(chartData){
	    if( chartData != undefined )
	    {
	        var sampleVal = chartData.rows[0][1];
	        var len = sampleVal.toString().length;
	    	return len * 10 + 30;	    
	    }
    }

    setNumSeries = function(data)
    {
    }

    this.refreshSeries = function()
    {
    }

	this.getOpt = function()
	{
		if( g != undefined )
		{
			return g.dateWindow_;
		}
		else
		{
			return null;
		}
		
	}
	
    optimizeData = function(data)
    {
        return data;
    }

    getCSVfromData = function(data)
    {
        var csv = "";
/*        for ( var i = 0; i < data.length; i++)
        {
            var row = data[i];
            csv +=  row[0];
            for ( var j = 1; j < row.length; j ++)
            {
                csv += "," + row[j];
            }
            csv += "\n"
        }*/
        return csv;
    }

    updateOpt = function(){

    }

    this.init = function(divId,_opt){
		chartName = divId;
		var opt = getOpt();
		if( opt != undefined )
		{
			opt.dateWindow = _opt;
		}
		

        g = new Dygraph(
            document.getElementById(divId),
            currentData,
            opt
        );
        

    }

    getOpt = function(){
        opt = {
            colors: ["#ead4ba","#fdd98e","#EFB839","#ead4ba"],
//            labels: ["x","y","z","t","s"],
            labels: ["time","today","none"],
            showRangeSelector: true,
            interactionModel: {
                'mousedown' : downV3,
                'mousemove' : moveV3,
                'mouseup' : upV3,
                'click' : clickV3,
                'dblclick' : dblClickV3,
                'mousewheel' : scrollV3
            } ,
            strokeWidth:2,
            xAxisLabelWidth: 39  ,
            axisLabelColor: ["#888A7F"],
            axisLineColor: "#2C7A62" ,
            gridLineColor: "#D6D6D6",
            axisLineWidth: 3,
            axes: {
              y: {
                valueFormatter: function(y) {
                  return formatPrice(y)+" ";
                },
                axisLabelFormatter: function(y) {
                   return formatPrice(y)+ " ";
                }
              },
              x: {
                  axisLabelFormatter: function(d, gran) {
                  	var label = "";
                  	if(chartName == "historyChart" ){
                  		if( d.getFullYear() % 2 == 0 && lastYearFormatter != d.getFullYear())
                  		{
	                   		label = Dygraph.zeropad(d.getDate()) + "/"
	                        	+ Dygraph.zeropad(d.getMonth()) + "/"
	                        	+ Dygraph.zeropad(d.getFullYear()) ;                		
                  		}else{
                  			label = "";
                  		}
                  		lastYearFormatter = d.getFullYear();
 
                  	}else{
                  		label = Dygraph.zeropad(d.getHours()) + ":"
                        + Dygraph.zeropad(d.getMinutes()) ;
                  	};
                  	/*if( chartName == "historyChart" ){
                  		//label = Dygraph.zeropad(d.getDate() + "/"+ d.getMonth() +"/"+d.getYear())
                  		label = "sds";//Dygraph.zeropad(d.getDate() + "/"+ d.getMonth() +"/"+d.getYear())
                  	}else{
                  		label = Dygraph.zeropad(d.getHours()) + ":"
                        + Dygraph.zeropad(d.getMinutes()) ;
                  	}*/
                    return label;
                  }
                }
			},
            visibility: [true,false],
            yAxisLabelWidth: 0,
            yRangePad: 10,
            pointSize: 0,
            drawPoints: true,
            labelsDivStyles: {
                'display': 'none'
            },

            unhighlightCallback: function(e, x, points, row, seriesName)
            {
              //  var tooltip =   $("#tooltip");
               // tooltip.css("display", "none");
            } ,

            highlightCallback: function(e, valx, points, row, seriesName)
            {
                var x = e.layerX;
                var y = e.layerY;
                var tooltip =   $("#tooltip");
                this.onmousemove = function(event){
                    var p = getClosestPoint(event,points);
                    var d = new Date(p.xval);

                    if( p != null && e != undefined && p != undefined)
                    {
                        var dist = getPointDistance(event,p);
                        if( dist != 1000 )
                        {
                            if ( dist > 40) {
                                tooltip.css("display", "none");
                            } else {
                                tooltip.css("display", "block");
                                tooltip.css({
                                    marginLeft: p.canvasx + 20,
                                    marginTop: p.canvasy - 4  + tooltip.height()
                                });
                                
                                if( chartName == "historyChart"){
                                	$("#date").html( "Historical Gold: " + getNumberWithZero(d.getDate()) + "-" + getNumberWithZero(d.getMonth()) + "-" + getNumberWithZero(d.getFullYear()) + "<br>  " + formatPrice(p.yval));
                                }else{
                                	$("#date").html(getNumberWithZero(d.getHours()) + ":" + getNumberWithZero(d.getMinutes()) + " New York Time ("+p.name+")<br>  " + formatPrice(p.yval));
                                }
                                
                            }
                        }
                    }
                }
            }
        }
        return opt;
    }

    getNumSeries = function()
    {
        var k = 0;
        for ( var i in seriesData)
        {
             k++;
        }
        return numSeries
    }

/*    getLabels = function(){
        var labels = [];
        labels.push("Date")
        for ( var i in seriesData)
        {
            labels.push(i);
        }
        return labels;
    }

    getVisibility = function(){
        var res = [];
        for ( var i = 0; i < getNumSeries();i++)
        {
            if( i == getNumSeries()-1 )
            {
                res.push(false);
            }
            else
            {
                res.push(true);
            }
        }
        if( res.length == 0 )
        {
            res = [true]
        }
        return res;
    }*/

    getClosestPoint = function(evt,points)
    {
        if( points != undefined && points.length > 0 )
        {
            var minDist = getPointDistance(evt,points[0]);
            var closestP = points[0];
            if( evt != undefined )
            {
                for ( var i = 1; i < points.length; i++ )
                {
                    var p = points[i];
                    var dist = getPointDistance(evt,p);
                    if( dist < minDist)
                    {
                        minDist = dist;
                        closestP = p;
                    }
                }
            }
            return closestP;
        }
        else
        {
            return null;
        }

    }

    getPointDistance = function(e,p)
    {

        if( p != null && !isNaN(p.canvasx) && !isNaN(p.canvasy) )
        {
            return getDistance(e.layerX, p.canvasx, e.layerY, p.canvasy);
        }
        else{
            return 10000;
        }

    }

    function downV3(event, g, context) {
        context.initializeMouseDown(event, g, context);
        if (event.altKey || event.shiftKey) {
            Dygraph.startZoom(event, g, context);

        } else {
            Dygraph.startPan(event, g, context);
        }
    }

    function moveV3(event, g, context) {
        if (context.isPanning) {
            Dygraph.movePan(event, g, context);
        } else if (context.isZooming) {
            Dygraph.moveZoom(event, g, context);
        }
    }

    function upV3(event, g, context) {
        if (context.isPanning) {
            Dygraph.endPan(event, g, context);
        } else if (context.isZooming) {
            Dygraph.endZoom(event, g, context);
        }
    }


    var lastClickedGraph = null;

    function clickV3(event, g, context) {
        lastClickedGraph = g;
        Dygraph.cancelEvent(event);
    }

    function scrollV3(event, g, context) {
        if (lastClickedGraph != g) {
            return;
        }
        var normal = event.detail ? event.detail * -1 : event.wheelDelta / 40;
        // For me the normalized value shows 0.075 for one click. If I took
        // that verbatim, it would be a 7.5%.
        var percentage = normal / 50;

        if (!(event.offsetX && event.offsetY)){
            event.offsetX = event.layerX - event.target.offsetLeft;
            event.offsetY = event.layerY - event.target.offsetTop;
        }

        var percentages = offsetToPercentage(g, event.offsetX, event.offsetY);
        var xPct = percentages[0];
        var yPct = percentages[1];

        zoom(g, percentage, xPct, yPct);
        Dygraph.cancelEvent(event);
    }

    // Take the offset of a mouse event on the dygraph canvas and
// convert it to a pair of percentages from the bottom left.
// (Not top left, bottom is where the lower value is.)
    function offsetToPercentage(g, offsetX, offsetY) {
        // This is calculating the pixel offset of the leftmost date.
        var xOffset = g.toDomCoords(g.xAxisRange()[0], null)[0];
        var yar0 = g.yAxisRange(0);

        // This is calculating the pixel of the higest value. (Top pixel)
        var yOffset = g.toDomCoords(null, yar0[1])[1];

        // x y w and h are relative to the corner of the drawing area,
        // so that the upper corner of the drawing area is (0, 0).
        var x = offsetX - xOffset;
        var y = offsetY - yOffset;

        // This is computing the rightmost pixel, effectively defining the
        // width.
        var w = g.toDomCoords(g.xAxisRange()[1], null)[0] - xOffset;

        // This is computing the lowest pixel, effectively defining the height.
        var h = g.toDomCoords(null, yar0[0])[1] - yOffset;

        // Percentage from the left.
        var xPct = w == 0 ? 0 : (x / w);
        // Percentage from the top.
        var yPct = h == 0 ? 0 : (y / h);

        // The (1-) part below changes it from "% distance down from the top"
        // to "% distance up from the bottom".
        return [xPct, (1-yPct)];
    }

    function dblClickV3(event, g, context) {
        // Reducing by 20% makes it 80% the original size, which means
        // to restore to original size it must grow by 25%

        if (!(event.offsetX && event.offsetY)){
            event.offsetX = event.layerX - event.target.offsetLeft;
            event.offsetY = event.layerY - event.target.offsetTop;
        }

        var percentages = offsetToPercentage(g, event.offsetX, event.offsetY);
        var xPct = percentages[0];
        var yPct = percentages[1];

        if (event.ctrlKey) {
            zoom(g, -.25, xPct, yPct);
        } else {
            zoom(g, +.2, xPct, yPct);
        }
    }

};