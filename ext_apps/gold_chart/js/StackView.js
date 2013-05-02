function StackView() {
    this.id;
    var chartMyStackButton;
    var goldStackInput;
    var silverStackInput;
    var platiniumStackInput;
    var palladiumStackInput;
    
    var title;
    var labelField;
    var infoField;

    this.init = function(parent){
        div =  $("<div id='stack' class='stackView'></div>");
        div.appendTo(parent);
        
        title = $('<div class="stackTitle">Track your stack:</div>');
        title.appendTo(div);

        goldStackInput = new StackInput();
        goldStackInput.init(div) ;
        goldStackInput.setType("Gold");

        silverStackInput = new StackInput();
        silverStackInput.init(div);
        silverStackInput.setType("Silver");

        platiniumStackInput = new StackInput();
        platiniumStackInput.init(div);
        platiniumStackInput.setType("Platinium");

        palladiumStackInput = new StackInput();
        palladiumStackInput.init(div);
        palladiumStackInput.setType("Palladium");
        
		var chartMyStackButtonDiv = $('<div class="chartMyStackButton"></div>');
        chartMyStackButtonDiv.appendTo(div);
        chartMyStackButtonDiv.css({
            fontWeight: "bold",
            display: "inline-block"
        });
        
        
		labelField = $('<div class="stackFieldLabel"></div>');
        labelField.appendTo(chartMyStackButtonDiv);
        labelField.css({
            fontSize: "12px"
        })
        
        chartMyStackButton = $('<input id="chartMyStackBtn" type="button" value="" class="button_add" />');
        chartMyStackButton.css({
            backgroundImage : "url('assets/chartmystack.png')",
            width : "139px",
            height : "35px",
            fontWeight: "bold"
        });

        
        chartMyStackButton.appendTo(chartMyStackButtonDiv);
        
        infoField = $('<div >0.00</div>');
        infoField.appendTo(chartMyStackButtonDiv);
        infoField.css({
            fontSize: "12px",
            marginTop: "4px"
        })
        
        chartMyStackButton.selected = false;
        chartMyStackButton.click(function(){
        	//chartMyStackButton.selected = !chartMyStackButton.selected;
        	//if( chartMyStackButton.selected == false )
        	//{
        		chartMyStackButton.selected = true;
				refreshChart();
				refreshSum();         	
        	//}
        })
        
        goldStackInput.setRefreshCallback(refreshStack);
        silverStackInput.setRefreshCallback(refreshStack);
        platiniumStackInput.setRefreshCallback(refreshStack);
        palladiumStackInput.setRefreshCallback(refreshStack);
    }
    
    this.onUpdate = function(isSelect)
    {
    	chartMyStackButton.selected = isSelect;
    	refreshButton();
    }
    
    refreshChart = function(){
		var data = {
	        gold: goldStackInput.getInputValue(),
	        silver: silverStackInput.getInputValue(),
	        platinium: platiniumStackInput.getInputValue(),
	        palladium: palladiumStackInput.getInputValue()
	    }

		refreshButton();
		
        AppModel.getInstance().chartMyStack(data);

        goldStackInput.setStackEnabled(chartMyStackButton.selected);
        silverStackInput.setStackEnabled(chartMyStackButton.selected);
        platiniumStackInput.setStackEnabled(chartMyStackButton.selected);
        palladiumStackInput.setStackEnabled(chartMyStackButton.selected);
    }
    
    refreshButton = function()
    {
    	var isSelected = chartMyStackButton.selected;
        if( isSelected )
        {
            selectStackButton();
        }else{
            unselectStackButton();
        }   
    }
    
    refreshStack = function(){
    	if( chartMyStackButton.selected) 
    	{
    		//refreshChart();
    	}
    	refreshSum();
    }
    
    refreshSum = function(){
    	var sum = goldStackInput.getTotalValue() + 
    		silverStackInput.getTotalValue() +
    		platiniumStackInput.getTotalValue() +
    		palladiumStackInput.getTotalValue();
    		
    	var currency = AppModel.getInstance().getSelectedCurrency();
    		
    	infoField.text( formatPrice(sum) + " " + currency);
    }

    selectStackButton = function(){
        chartMyStackButton.css({
            backgroundImage : "url('assets/chartmystack2.png')"
        })
    }

    unselectStackButton = function(){
        chartMyStackButton.css({
            backgroundImage : "url('assets/chartmystack.png')"
        })
    }

    this.update = function()
    {
        var m = AppModel.getInstance();
        var currency = m.getSelectedCurrency();

        goldStackInput.setCurrent(m.getGoldData()[0].current) ;
        silverStackInput.setCurrent(m.getSilverData()[0].current);
        platiniumStackInput.setCurrent(m.getPlatiniumData()[0].current);
        palladiumStackInput.setCurrent(m.getPalladiumData()[0].current);
        
        refreshSum();
    }
    
    this.getChartStackButton = function(){
    	return chartMyStackButton;
    }
}
