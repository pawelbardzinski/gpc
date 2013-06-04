function GoldpriceView() {
    this.id;
    var tabs;
    var nav;
    var chartsView;
    var stackView;
    var div;
    var img;
    var bgs = ["assets/gold-bg.png", "assets/silver-bg.png", "assets/plat-bg.png","assets/pal-bg.png"]
    var updateInfo;
    var progressRingDiv;
    var progressRing;
    var timeDiv;
    var intrv
    var selectedTabId;
    var spinDiv;
    var chartUpdatedInfo;
    var resized = false;
    var isFirstTime = true;
    var spinOpts;

    this.init = function(){
        div = $("#goldpriceView");

        tabs = new Tabs();
        tabs.init(div);

 		var innerDiv = $('<div class="innerDiv"></div>');
        innerDiv.appendTo(div);

        nav = new Navigation();
        nav.init(innerDiv);

        var infoDiv = $('<div></div>')
        infoDiv.appendTo(innerDiv);
        infoDiv.css({
            marginTop: "10px",
            marginLeft: "71px",
            height: "40px",
            width: "100%"
        })

        progressRingDiv = $('<canvas id="progressRing1" width="30" height="30" >');
        progressRingDiv.appendTo(infoDiv);
        progressRingDiv.css({
        	marginLeft: "0px"
        })

        updateInfo = $('<div><p style="display:inline"></div>') ;
        updateInfo.appendTo(infoDiv);
        updateInfo.css({
            marginLeft: "40px",
            marginTop: "-27px",
            fontFamily: "Tahoma",
            fontSize: "14px",
            color: "#aaaaaa"
        });


        progressRing = new ProgressRing("progressRing1");
        progressRing.stop();
        
        var chartsViewDiv = $('<div></div>');
        chartsViewDiv.appendTo(innerDiv);
		chartsView = new ChartsView();
        chartsView.init(chartsViewDiv);
        
		chartUpdatedInfo = $('<div id="chartUpdatedInfo" class="chartUpdatedInfo">CHART UPDATED</div>');
        chartUpdatedInfo.appendTo(div);

        var stackDiv = $('<div></div>') ;
        stackView = new StackView();
        stackView.init(stackDiv);
        stackDiv.appendTo(innerDiv);

        spinDiv = $('<div id="spin"></div>');
        spinDiv.appendTo(div);
        spinOpts = {
            lines: 13, // The number of lines to draw
            length: 10, // The length of each line
            width: 5, // The line thickness
            radius: 10, // The radius of the inner circle
            corners: 1, // Corner roundness (0..1)
            rotate: 0, // The rotation offset
            direction: 1, // 1: clockwise, -1: counterclockwise
            color: '#006b4f', // #rgb or #rrggbb
            speed: 1, // Rounds per second
            trail: 60, // Afterglow percentage
            shadow: false, // Whether to render a shadow
            hwaccel: false, // Whether to use hardware acceleration
            className: 'spinner', // The CSS class to assign to the spinner
            zIndex: 2e9, // The z-index (defaults to 2000000000)
            top: 'auto', // Top position relative to parent in px
            left: 'auto' // Left position relative to parent in px
        };
        
        spinDiv.css({
            zIndex: "111",
            //uposition: "absolute",
            marginLeft: "auto",
            //marginTop: "-18px"
            marginTop: "-350px"
        });
        
        spinDiv.spin(spinOpts);

        //img = $('<img src="assets/plat2.png" class="bgImage"/>')
        //img.appendTo(div);

        addHandlers();

        AppModel.getInstance().connect();
        //AppModel.getInstance().update();
        AppModel.getInstance().setRefreshCallback(refresh);
        AppModel.getInstance().setInitCallback(initData);
        AppModel.getInstance().setRemainingTimeCallback(remainingTimeCallback);

        //chartsView.updateData(AppModel.getInstance().getGoldData());
       // chartsView.selectChartById(0);
        selectTab(0);
        selectChartButton(0);
        
        $(window).resize(function() {
        	resized = true;
        });
    }

    remainingTimeCallback = function(time)
    {
        clearInterval(intrv);
        var val = formatTime(time);

        var percent = (120-time)/120;
        if(!AppModel.getInstance().isWeekend()){
			updateInfo.html('<div id="updateInfo"><p style="display:inline, color: #000000">Next live price update:</p><p style="display: inline;font-weight: bold;color: #ff0000"> '+val+'</p></div>');

	        progressRing.setPeriod(120 * 1000)
	        progressRing.reset(percent);
	        progressRing.start();
	        
			intrv = setInterval(function(){
            AppModel.getInstance().setRemainingTime(AppModel.getInstance().getRemainingTime()-1)
            	var val = formatTime(AppModel.getInstance().getRemainingTime());
	
            	updateInfo.html('<div id="updateInfo"><p style="display:inline, color: #000000">Next live price update:</p><p style="display: inline;font-weight: bold;color: #ff0000"> '+val+'</p></div>');
        	},1000);
        }else{
        	updateInfo.html('<div id="updateInfo"><p style="display:inline, color: #000000"><b>Weekend. The Market is Closed.</b></div>');
        }

		if( time == 120)
		{
		        chartUpdatedInfo.css({
		            display: "block"
		        });
		        setTimeout(function(){
		            chartUpdatedInfo.css({
		                display: "none"
		            });
		        },4000);
		}

    }

    initData = function()
    {
        refresh();
    }

    refresh = function(mode)
    {
        spinDiv.spin(false)
        var m = AppModel.getInstance();
        var ratioData = m.getRatioData();
        var gldSlvRatioData = m.getGldSlvRatioData();
        var gldPltRatioData = m.getGldPltRatioData();
        var seriesData = getSelectedData(selectedTabId);
        var chartMyStackData = m.getChartMyStackData();
        
        if( mode == undefined ) {mode=3};
        if( isFirstTime ){
        	isFirstTime = false;
        	mode = 1; // za pierwszym razem odswiezamy tylko jeden wykres, zeby skrocic czas wyswietlania
        }
        chartsView.updateData(seriesData, gldSlvRatioData, gldPltRatioData, chartMyStackData,mode );
        
        tabs.update();
        tabs.selectUnit(AppModel.getInstance().getSelectedUnit());
        nav.update();
        stackView.update();
        
        if(m.isWeekend()){
        	//progressRing.setPeriod()
        	progressRing.reset();
        	progressRing.stop();
        }
    }
    
    getIsChartMyStack = function()
    {
    	return stackView.getChartStackButton().selected;
    }

    addHandlers = function(){
        nav.todayButton.click(function() {
            selectChartButton(0);
        });
        nav.lastDaysButton.click(function() {
        	selectChartButton(1);
        });
        nav.historyButton.click(function() {
        	if( tabs.getSelectedTabId() == 0 ){
        		var updated = AppModel.getInstance().getHistoryData();
        		if( updated )
        		{
        			spinDiv.spin(spinOpts);
        		}
        		selectChartButton(2);
        	}
        });
        nav.gldSlvRatioButton.click(function() {
           selectRatioButton(3);
           selectTab(4);
           //nav.selectRatioButton(3);
        });
        nav.gldPltRatioButton.click(function() {
            selectRatioButton(4);
          	selectTab(5);
          	//nav.selectRatioButton(4);
        });

        tabs.goldTab.click(function() {
            selectTab(0);
        });
        tabs.silverTab.click(function() {
            selectTab(1);
        });
        tabs.platinmTab.click(function() {
            selectTab(2);
        });
        tabs.palladimTab.click(function() {
            selectTab(3);
        });
        tabs.currencyTabList.change(function(){
            //var selectedCurrency = tabs.currencyTabList[0].selectedOptions[0].value;
            var selectedList = tabs.currencyTabList[0].options;
            var selectedIndx = selectedList.selectedIndex;
            var selectedValue = selectedList[selectedIndx].value;
            AppModel.getInstance().changeCurrency(selectedValue);
        })
        
        stackView.getChartStackButton().click(function() {
           selectChartButton(nav.getSelectedButtonId());
           selectTab(-1);
        });

        /*tabs.dropdown.itemSelected = function(item)  {
            var selectedCurrency =  item.data;
            AppModel.getInstance().changeCurrency(selectedCurrency);
        };*/
    }

    selectChartButton = function(id)
    {
    	nav.selectButton(id);   	
    	
    	if( id == 0 && getIsChartMyStack() )
    	{
    		selectChartById(7);
    	}
    	else if( id == 1 && getIsChartMyStack() )
    	{
    		selectChartById(8);
    	}
    	else
    	{
    		// gldSlvRatio
        	if( nav.getSelectedRatioButtonId() == 3 && id == 0)
        	{
        		selectChartById(3);// todayChart
        	}
        	// gldPltRatio
        	else if( nav.getSelectedRatioButtonId() == 4 && id == 0)
        	{
        		selectChartById(5);// todayChart
        	}        	
        	else if( nav.getSelectedRatioButtonId() == 3 && id == 1)
        	{
        		selectChartById(4);
        	}
        	else if( nav.getSelectedRatioButtonId() == 4 && id == 1)
        	{
        		selectChartById(6);
        	}
        	else
        	{
            	selectChartById(id);
            }
    	}
    }
    
    selectRatioButton = function(id)
    {
    	if( nav.getSelectedButtonId() == 2 )
    	{
    		selectChartButton(0);
    	}
    	nav.selectRatioButton(id); 
    	if( nav.getSelectedButtonId() == 0 && id == 3 )
    	{
    		selectChartById(3);
    	}
    	else if( nav.getSelectedButtonId() == 0 && id == 4 )
    	{
    		selectChartById(5);
    	}
    	else if( nav.getSelectedButtonId() == 1 && id == 3 )
    	{
    		selectChartById(4);
    	}
    	else if( nav.getSelectedButtonId() == 1 && id == 4 )
    	{
    		selectChartById(6);
    	}   
    	else
    	{
    		console.log("EC001",nav.selectedButtonId,id);
    	}	
    	
    	
    }
    
    selectChartById = function(id)
    {
    	chartsView.selectChartById(id);
    	
    	if( resized )
    	{
    		resized = false;
	    	refresh();
    	}
    }

    selectTab = function(id)
    {
        selectedTabId = id;
        var m = AppModel.getInstance();
		var gldSlvRatioData = m.getGldSlvRatioData();
        var gldPltRatioData = m.getGldPltRatioData();
        
		if( id == -1 )
		{
			tabs.selectTab(id);
			nav.selectRatioButton(-1);
		}
		else if( id == 4 || id == 5)
		{
			tabs.selectTab(id);
			
			stackView.onUpdate(false);	
	        selectChartButton(nav.getSelectedButtonId());
		}
		else
		{
			chartsView.updateData( getSelectedData(id), gldSlvRatioData, gldPltRatioData, AppModel.getInstance().getChartMyStackData());
	        tabs.selectTab(id);
	        div.css({
	            backgroundImage: "url("+bgs[id]+")",
	            backgroundRepeat: "no-repeat",
	            backgroundColor: "#e3e4dc"
	        });
	       
	       // chart my stack
	        stackView.onUpdate(false);	
	        selectChartButton(nav.getSelectedButtonId());
	       // ratio
	        nav.selectRatioButton(-1);
	        
			if( nav.getSelectedButtonId() == 2 && tabs.getSelectedTabId() != 0 )
	        {
	        	selectChartButton(0);
	        }	
	        else
	        {
	        	// odswiezenie aktualnego wykresu po zmianie zakladki 
	        	selectChartButton(nav.getSelectedButtonId());
	        }
		}
		nav.onChangeTab(id);
    }

    getSelectedData = function(id){
        switch (id)
        {
            case 0:
                return AppModel.getInstance().getGoldData();
                break;

            case 1:
                return AppModel.getInstance().getSilverData();
                break;

            case 2:
                return AppModel.getInstance().getPlatiniumData();
                break;

            case 3:
                return AppModel.getInstance().getPalladiumData();
                break;
                
			default : 
				return AppModel.getInstance().getGoldData();
				break;
                
        }
        return null;
    }

}
