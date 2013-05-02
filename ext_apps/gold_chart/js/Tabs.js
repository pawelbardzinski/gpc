function Tabs() {
    this.id;

    this.goldTab;
    this.silverTab;
    this.platinmTab;
    this.palladimTab;
    this.currencyTabList;
    this.dropdown;
    this.unitSelector;
    this.ozButton;
    this.grButton;

    var buttons = [];
    var selectedTabId = -1;


    this.init = function(parent){
        var div =  $("<div id='tabs' class='tabs'></div>");
        div.appendTo(parent);

        this.goldTab = $('<input id="0" type="button" value="GOLD" class="button_add" />');
        this.silverTab = $('<input id="1" type="button" value="SILVER" class="button_add" />');
        this.platinmTab = $('<input id="2" type="button" value="PLATINIUM" class="button_add" />');
        this.palladimTab = $('<input id="3" type="button" value="PALLADIUM" class="button_add" />');

        this.goldTab.appendTo(div);
        this.silverTab.appendTo(div);
        this.platinmTab.appendTo(div);
        this.palladimTab.appendTo(div);

        //

        buttons = [this.goldTab, this.silverTab, this.platinmTab, this.palladimTab];

        for (var b = 0; b < buttons.length; b++) {
            //buttons[b].style.backgroundImage = "url('tab1.png')";
            buttons[b].id = b;
            buttons[b].data = false;
            buttons[b].ppp = false;
            buttons[b].getActive = function(){
            	return this.active;
            }
            $(buttons[b]).css({
                backgroundImage : "url('assets/tab1.png')",
                width : "170px",
                height : "35px",
                marginRight: "0px"
            });
            $(buttons[b]).mouseover(function(){
            	if( this.id != selectedTabId ){
                  	overEffect(this);
                }
            });
            $(buttons[b]).mouseout(function(){
            	if( this.id != selectedTabId ){
                	outEffect(this);
                }
            });
        }
        var bar = $('<div style="width:100%;height: 6px;background-color:#FCBC14"></div>');
        bar.appendTo(div);
        
		var ddDiv = $('<div id="dd" class="dropdown" ><p class="dropdown-header"></p><div class="dropdown-pane"></div></div>');
        //ddDiv.appendTo(div);
        /*ddDiv.css({
        	backgroundImage : "url('assets/money.png')",
        	width: "145px",
            height: "40px",
        	marginLeft: "100px",
            marginTop:"-40px"
        })

        this.dropdown = new DropDown('dd');
        this.dropdown.setItems([{label:"USD",data:{}}])
        this.dropdown.setSelected('USD');*/
       
       	var currencyTabCont = $('<div></div>');
		currencyTabCont.appendTo(div);
		currencyTabCont.css({
        	backgroundImage : "url('assets/money2.png')",
        	width: "110px",
        	height: "40px",
        	//display: "inline-block",
        	marginTop: "-40px",
         	marginLeft: "700px",
            marginTop:"-40px",
            position: "relative"
		});

        this.currencyTabList = $('<select id="slct2" name="slct2" style="width: 100px"><option>USD</option></select>') ;
        this.currencyTabList.appendTo(currencyTabCont);
        this.currencyTabList.css({
        	width: "80px",
        	height: "20px"
        });
        this.currencyTabList.customSelect();


        this.unitSelector = $('<div class="unitSelector"></div>') ;
        this.unitSelector.appendTo(div);
        this.unitSelector.css({
            backgroundImage : "url('assets/last.png')",
            width: "145px",
            height: "40px",
            marginLeft: "815px",
            marginTop:"-40px",
            position: "relative"
        }) ;

        this.ozButton = $('<input id="rb1" type="button" class="button_add" />');
        this.grButton = $('<input id="rb2" type="button" class="button_add" />');
        this.ozButton.appendTo(this.unitSelector);
        this.grButton.appendTo(this.unitSelector);
        this.ozButton.css({
            backgroundImage : "url('assets/rad.png')",
            width: "22px",
            height: "22px",
            marginTop: "9px",
            marginLeft: "47px",
            marginRight: "26px"
        })
        this.grButton.css({
            backgroundImage : "url('assets/rad.png')",
            width: "22px",
            height: "22px",
            marginTop: "9px"
        });
        this.ozButton.click(function(){
            AppModel.getInstance().selectUnit(0);
        });
        this.grButton.click(function(){
            AppModel.getInstance().selectUnit(1);
        })
        


    }

    this.update = function()
    {
        var m = AppModel.getInstance();
//        this.currencyTabList.options.add("test");
        var items = AppModel.getInstance().getCurrencyItems();
        this.currencyTabList[0].options.length = 0
        //var dditems = new Array();
        for ( var i in items)
        {
            var option = document.createElement("option");
            option.text = items[i].label;
            option.value = items[i].data;
            if( option.value == m.getSelectedCurrency() )
            {
            	option.selected = true;
            	this.currencyTabList.select();
            }
            this.currencyTabList.append(option);

           // dditems.push( {label:items[i].label, data:items[i].data } );
        }

        //this.dropdown.setItems(dditems);
        //this.dropdown.setSelected(m.getSelectedCurrency());

        this.goldTab.val("GOLD " + formatPrice(m.getGoldData()[0].current) );
        this.silverTab.val("SILVER " + formatPrice(m.getSilverData()[0].current) );
        this.platinmTab.val("PLATINIUM " + formatPrice(m.getPlatiniumData()[0].current) );
        this.palladimTab.val("PALLADIUM " + formatPrice(m.getPalladiumData()[0].current) );
    }

    this.selectUnit = function(id)
    {
        if( id == 0 )
        {
            this.ozButton.css({
                backgroundImage : "url('assets/rat2.png')"
            })
            this.grButton.css({
                backgroundImage : "url('assets/rad.png')"
            })
        }
        else
        {
            this.ozButton.css({
                backgroundImage : "url('assets/rad.png')"
            })
            this.grButton.css({
                backgroundImage : "url('assets/rat2.png')"
            })
        }
    }

    this.selectTab = function(id)
    {
    	selectedTabId = id;
        for ( var i = 0; i < buttons.length; i++ )
        {

            var bt = buttons[i];
            if( bt.id == id)
            {
            	bt.active = true;
                selectedEffect(bt);
            }
            else
            {
            	bt.active = false;
                unselectedEffect(bt);
            }
        }
    }

    overEffect = function(div)
    {
        $(div).css({
            color : "#000000"
        });
    }

    outEffect = function(div)
    {
        $(div).css({
            color : "#ffffff"
        });
    }
    
    this.getSelectedTabId = function(){
    	return selectedTabId;
    }

    selectedEffect = function(div)
    {
        $(div).css({
            backgroundImage : "url('assets/tab1.png')",
            width : "170px",
            height : "35px",
            marginRight: "5px",
            color : "#000000",
            fontSize : "12px"
        });
    }

    unselectedEffect = function(div)
    {
        $(div).css({
            backgroundImage : "url('assets/tab2.png')",
            width : "170px",
            height : "35px",
            marginRight: "5px",
            color : "#ffffff",
            fontSize : "12px"
        });
    }

}
