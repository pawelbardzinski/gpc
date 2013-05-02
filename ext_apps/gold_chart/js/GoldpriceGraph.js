function GoldpriceGraph() {
    this.name = name;
    this.g;
    var str = "";
    var d;
    var isFirstTime = true;


	this.getOpt = function()
	{
	}
	
    this.init = function(){
        d = new Date();
        str = "date,test,price\n";
        str += "2013/02/21 01:00:00,50, null\n";
        str += "2013/02/ 23:00:00,50, null\n";
        for ( var i = 0; i < 10; i++ )
        {
            str += getRandomPoint();
        }
        g = new Dygraph(
            document.getElementById("golpricegraph"),
            str,
            {
                colors: ["#EFB839"],
                showRangeSelector: true,
                interactionModel: {
                    'mousedown' : downV3,
                    'mousemove' : moveV3,
                    'mouseup' : upV3,
                    'click' : clickV3,
                    'dblclick' : dblClickV3,
                    'mousewheel' : scrollV3
                } ,
                xAxisLabelWidth: 39  ,
                axisLabelColor: ["#888A7F"],
                axisLineColor: "#2C7A62" ,
                gridLineColor: "#D6D6D6",
                axisLineWidth: 3,
                "price" : {
                    strokeWidth: 2
                },
                visibility: [false,true]   ,
                yAxisLabelWidth: 60,
                yRangePad: 10,
                axes: {

                    y: {
                        axisLabelFormatter: function(y) {
                            return y + "    ";
                        }
                    }
                },
                highlightSeriesOpts:{},
                labelsDivStyles: {
                    'display': 'none'
                },
                highlightCallback: function(e, x, points, row, seriesName)
                {
                    var x = e.offsetX;
                    var y = e.offsetY;
                    var dataXY = g.toDataCoords(x, y);
                    var p = points[0];
                    var tooltip =   $("#tooltip");

                    tooltip.css(
                        {
                            marginLeft: p.canvasx + 4,
                            marginTop: p.canvasy - 4 - tooltip.height()
                        }
                    );
                    var d = new Date(p.xval);
                    $("#date").html(d.getHours() + ":" + d.getMinutes() + " New York Time (today)<br>  " + p.yval   );

                    var dist = getDistance(x,y, p.canvasx, p.canvasy);
                    if ( isNaN(p.yval) && dist < 50) {
                        tooltip.css("display", "none");
                    } else {
                        tooltip.css("display", "block");
                     }
                }
            }
        );

        initSlider();

    }

    function initSlider()
    {
        $("#noUiSlider").noUiSlider({
            range: [20, 100]
            ,start: [40, 80]
            ,step: 1
            ,slide: function(){
                var values = $(this).val();
                $("span").text(
                    values[0] +
                        " - " +
                        values[1]
                );
            }
        });
    }

    this.addRandomPoint = function(){
        str += getRandomPoint();
        g.updateOptions( {
            file: str
        } );
    }

    function getRandomPoint()
    {
        d.setMinutes(d.getMinutes()+2);

        var x = "" +
            d.getFullYear() + "/" +
            getWithZero(d.getMonth()) + "/" +
            getWithZero(d.getDate()) +" " +
            getWithZero(d.getHours()) + ":" +
            getWithZero(d.getMinutes()) + ":" +
            getWithZero(d.getSeconds());

        var y = Math.random()*100 ;

        return x + ",50," + y + "\n";
    }

    function getWithZero(num)
    {
        if( num < 10)
        {
            return "0" + num;
        }
        return num;
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