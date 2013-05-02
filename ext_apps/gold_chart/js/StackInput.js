function StackInput() {
    var div;
    var inputField;
    var infoField;
    var labelField;
    var inputContainer;
    this.id;
    this.inputField;
    this.label;
    this.infoField;

    var current = 1;
    var inputVal = 0;
    var totalValue = 0;
    var type;
    var stackEnabled = false;
    
    var lastInputVal = -1;
    
    var refreshCallback;
    this.setRefreshCallback = function(func){
    	refreshCallback = func;
    }  

    this.init = function(parent){
        div =  $("<div id='stack' class='stackInput'></div>");
        div.appendTo(parent);

        labelField = $('<div class="stackFieldLabel"></div>');
        labelField.appendTo(div);
        labelField.css({
            fontSize: "12px"
        })
        
        inputContainer = $('<div class="stackField"></div>');
        inputContainer.appendTo(div);
		inputContainer.css({
        	backgroundImage : "url('assets/stackFieldBg.png')"
        });

        inputField =  $('<input type="input" maxlength="20" width="100px"></div>');
        inputField.appendTo(inputContainer);
        inputField.val("0.00");

        infoField = $('<div class="stackFieldInfo">0.00</div>');
        infoField.appendTo(div);
        infoField.css({
            fontSize: "12px"
        })
        
        inputField.focus(function(evt) {
        	if(inputField.val() == "0.00")
        	{
        		inputField.val("");
        	}
        });
        
        inputField.focusout(function(evt) {
        	if(inputField.val() == "")
        	{
        		inputField.val("0.00");
        	}
        });
        
        inputField.keypress(function validate(evt) {
		  var theEvent = evt || window.event;
		  var keyCode = theEvent.keyCode || theEvent.which;
		  var key = String.fromCharCode( keyCode );
		  var regex = /[0-9]|\./;
		  
		  if( keyCode == 8 )
		  {
		  	return 1;
		  }
		  if( !regex.test(key) ) {
		    theEvent.returnValue = false;
		    if(theEvent.preventDefault) theEvent.preventDefault();
		  }
		})
        
        inputField.keyup(function(evt){
            var val = inputField.val();
			if( val >= 1000000 )
			{
				if( lastInputVal == -1 )
				{
					inputField.val(999999)
				}else{
					inputField.val(lastInputVal);
				}
				
			}
			else
			{
            	changeValue(val);
            	lastInputVal = val;			
			}
          
        });
    }

    this.getInputValue = function()
    {
        if( inputVal == 0 )
        {
            return 0;
        }
        return inputVal;
    }
    
    this.getTotalValue = function(){
    	return totalValue;
    }

    this.setType = function(val)
    {
        type = val;
        var unit = AppModel.getInstance().getSelectedUnitName();
        labelField.text(type + " " +unit);
    }

    this.setCurrent = function(val){
        current = Math.round(val*100)/100;
        changeValue(inputVal,false);
    }

    this.setStackEnabled = function(val){
        stackEnabled = val;
        changeValue(inputVal,false);
    }

    var changeValue = function(val,sendCallback)
    {
    	if( sendCallback == undefined ) sendCallback = true;
        inputVal = val;
        if( !isNaN(val))
        {
            var res = val * current;
            /*if( stackEnabled )
            {
            	if( Number(inputVal) == 0 ) 
            	{
            		res = 0;
            	}else{
            		res = current;
            	}
                
            }*/
            var currency = AppModel.getInstance().getSelectedCurrency();
            var label = formatPrice(res) + " " + currency;
            totalValue = res;
            infoField.text(label) ;
        }

        var unit = AppModel.getInstance().getSelectedUnitName();
        labelField.text(type + " " +unit);
        
        if( sendCallback ){
        	refreshCallback();
        }
        
    }
}
