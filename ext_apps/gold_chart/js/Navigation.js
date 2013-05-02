function Navigation() {
    this.id;
    this.todayButton;
    this.lastDaysButton;
    this.historyButton;
    this.img;
    this.gldSlvRatioButton;
    this.gldPltRatioButton;
    this.titleField;

    var buttons;
    var div;
    var selectedTabId = 0;
    var lastSelectedTabId = 0;
    var title;
    var selectedButtonId = 0;
    var allButtons;
    
    var ratioButtons;
    var selectedRatioButtonId;

    this.init = function(parent){
        div =  $("<div id='nav' class='navigation'></div>");
        div.appendTo(parent);

        this.titleField = $('<div id="navTitle" class="title">GOLD: 321321.2</div>');
        this.titleField.appendTo(div);

        title = this.titleField;

        this.todayButton = $('<input type="button" value="  Today" class="button_add" />');
        this.lastDaysButton = $('<input type="button" value="  Last 3 days" class="button_add" />');
        this.historyButton = $('<input type="button" value="  History" class="button_add" />');
        this.todayButton.appendTo(div);
        this.lastDaysButton.appendTo(div);
        this.historyButton.appendTo(div);

        var vline = $('<img src="assets/vline.png" style="margin-top: -60px;vertical-align: top"/>');
        vline.appendTo(div);

        this.gldSlvRatioButton = $('<input type="button" value="  Gld/Slv Ratio" class="button_add" />');
        this.gldPltRatioButton = $('<input type="button" value="  Gld/Plt Ratio" class="button_add" />');
        this.gldSlvRatioButton.appendTo(div);
        this.gldPltRatioButton.appendTo(div);

        this.todayButton.css({
            marginLeft: "360px"
        })
        
		allButtons = [this.todayButton, this.lastDaysButton, this.historyButton,this.gldSlvRatioButton,this.gldPltRatioButton];
        buttons = [this.todayButton, this.lastDaysButton, this.historyButton];
		ratioButtons = [this.gldSlvRatioButton,this.gldPltRatioButton];

        for (var b = 0; b < allButtons.length; b++) {
        	if(b == 0 || b == 2 )
        	{
        		initButton(allButtons[b],b, "short");
        	}else{
        		initButton(allButtons[b],b, "long");
        	}
        }
        
        /*for (var br = 0; br < ratioButtons.length; br++) {
            initButton(ratioButtons[br],br+4, "long");
        }*/

        this.historyButton.css({
            opacity : "1"
        });


    }
    
    initButton = function(bt,btId, type)
    {
		if(bt)
        {
            bt.id = btId;
            if( type == "short" )
            {
                $(bt).css({
                    backgroundImage : "url('assets/chart_button_short_out.png')",
                    width : "84px",
                    height : "38px",
                    fontWeight: "bold",
                    verticalAlign: "top",
                    textAlign: "center",
                    marginTop: "-57px"
                });                
            }
            else
            {
                $(bt).css({
                    backgroundImage : "url('assets/chart_button_out.png')",
                    width : "114px",
                    height : "38px",
                    fontWeight: "bold",
                    verticalAlign: "top",
                    textAlign: "center",
                    marginTop: "-57px"
                });                
            }

            $(bt).mouseover(function(){
            	overButtonEffect(this);
            });
            $(bt).mouseout(function(){
               	outButtonEffect(this);
            });
        }   
    }

    this.update = function()
    {
        updateTitle();
    }

    this.onChangeTab = function(id)
    {
    	if( selectedTabId >= 0 && selectedTabId <= 3 )
    	{
    		//zapamietujemy ostatnia zakladke poza 'chart my stack' i 'ratio'
	        lastSelectedTabId = selectedTabId;
    	}
        selectedTabId = id;
        
        var tabId = selectedTabId;
    	if( tabId < 0 || tabId > 3 )
    	{
    		tabId = lastSelectedTabId;
    	}

        div.css({
            backgroundImage: "url(assets/nav/"+tabId+"a.png)",
            backgroundRepeat: "no-repeat"
        });
        
        if( id == 0 ){
          	this.historyButton.css({
            	opacity : "1"
        	});      
        }else{
           	this.historyButton.css({
            	opacity : "0.5"
        	});          
        }

        updateTitle();
    }

    updateTitle = function()
    {
		var tabId = selectedTabId;
    	if( tabId < 0 || tabId > 3 )
    	{
    		tabId = lastSelectedTabId;
    	}
    	
        var m = AppModel.getInstance();
        var currency = m.getSelectedCurrency();
        var value = "";
        var label;
        if( m.getGoldData()[0] && m.getGoldData()[0].current != undefined )
        {
            switch (tabId)
            {
                case 0: value = m.getGoldData()[0].current;break;
                case 1: value = m.getSilverData()[0].current;break;
                case 2: value = m.getPlatiniumData()[0].current;break;
                case 3: value = m.getPalladiumData()[0].current;break;
            }

            label = currency + ": " + formatPrice(value);
        }
        else
        {
            label = "";
        }


//        $("navTitle").html("dasdas");
//        console.log("this.title",title);
//        this.title[0].html("dasds")
        title.html(label);
    }

    this.selectButton = function(id)
    {
    	selectedButtonId = id;
        for ( var i = 0; i < buttons.length; i++ )
        {
            var bt = buttons[i];
            if( bt.id == id)
            {
            	bt.active = true;
                selectedButtonEffect(bt);
            }
            else
            {
            	bt.active = false;
                unselectedButtonEffect(bt);
            }
        }
    }
    
    this.selectRatioButton = function(id)
    {
    	selectedRatioButtonId = id;
        for ( var i = 0; i < ratioButtons.length; i++ )
        {
            var bt = ratioButtons[i];
            if( bt.id == id)
            {
            	bt.active = true;
                selectedButtonEffect(bt);
            }
            else
            {
            	bt.active = false;
                unselectedButtonEffect(bt);
            }
        }
    }
    
    this.getSelectedButtonId = function(){
    	return selectedButtonId;
    }
    
	this.getSelectedRatioButtonId = function(){
    	return selectedRatioButtonId;
    }

    overButtonEffect = function(div)
    {
        $(div).css({
            color: "#668575"
        });
    }

    outButtonEffect = function(div)
    {
        $(div).css({
            color: "#000000"
        });
    }

    selectedButtonEffect = function(div)
    {
        $(div).css({
            backgroundImage : "url('assets/chart_button_over.png')",
            marginRight: "5px",
            color : "#000000",
            fontSize : "11px"
        });
        
        if( div.id == 0 || div.id == 2 )
		{
			$(div).css({
				backgroundImage : "url('assets/chart_button_short_over.png')"
			});
		}
    }

    unselectedButtonEffect = function(div)
    {
        $(div).css({
            backgroundImage : "url('assets/chart_button_out.png')",
            marginRight: "5px",
            color : "#000000",
            fontSize : "11px"
        });
        
		if( div.id == 0 || div.id == 2 )
		{
			$(div).css({
				backgroundImage : "url('assets/chart_button_short_out.png')"
			});
		}
    }
}
