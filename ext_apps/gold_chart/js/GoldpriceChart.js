function GoldpriceChart(n) {
    this.id;
    var g;
    var div
    var tooltip;
    var divId;
    var resetDateWindow;

	this.getOpt = function()
	{
		return g.getOpt();
	}
	
	this.getYlabelWidth = function(){
    	return g.getYlabelWidth();
    }
    
    this.calculateYlabelWidth = function(data){
        return g.calculateYlabelWidth(data);
    }
	

    this.init = function(_divId, _opt){
        divId = _divId;
        div = $("#"+divId);
        g =  new PanDygraph(divId);
    }

    this.setSeriesData = function(data,resetDateWindow)
    {
        return g.setSeriesData(data,resetDateWindow);
    }

    this.start = function(_opt)
    {
        g.init(divId,_opt);
        g.refreshSeries();
    }

    this.addTestSeries = function(seriesName)
    {
        for ( var i = 1; i < 10; i++ )
        {
            g.addPoint(seriesName,i,getRandValue());
        }
    }

    this.resetData = function()
    {
        g.resetData();
    }

    getRandValue = function()
    {
           return Math.random() * 1000;
    }

    this.show = function(){
        div.css({
            display : "block",
            width: "100%"
        });
        g.refreshSeries();
    }

    this.hide = function(){
        div.css({
            display : "none"
        });
    }

}

