var DropDown = function(id) {

    var main = $("#" + id);
    var dropdownList = main.find(".dropdown-pane");
    var dropdownHeader = main.find(".dropdown-header");
    var myItems = {};
    var selected = null;

    dropdownList.jScrollPane();

    var api = dropdownList.data('jsp'); 

    this.itemClick = function ( label ) {

        this.toggleDropdown();
        this.setSelected(label);                                

    };

    this.setSelected = function ( label ) {

        dropdownHeader.html(label);

        if(selected) {
            $(myItems[selected].element).removeClass("dropdown-item-selected");                       
        }                  
        selected = label;
        $(myItems[selected].element).addClass("dropdown-item-selected");

        if(this.itemSelected) {
            this.itemSelected(myItems[label].item);
        }

    };

    this.clearItems = function() {

        dropdownList.find('p').remove();
        dropdownList.jScrollPane();
        myItems = {};

    };

    this.addItem = function( item ) {

        var listItem =$("<p></p>").text(item.label);
        listItem.addClass("dropdown-item");
        listItem.on("click", this.itemClick.bind(this,item.label) );

        api.getContentPane().append(listItem); 
        myItems[ item.label ] = { item: item, element: listItem };

        dropdownList.jScrollPane();

    };

    this.addItems = function( items ) {

        for( var i=0; i<items.length; i++) {

            var listItem =$("<p></p>").text(items[i].label);
            listItem.addClass("dropdown-item");
            listItem.on("click", this.itemClick.bind(this,items[i].label) );

            api.getContentPane().append(listItem);                      
            myItems[ items[i].label ] = { item: items[i], element: listItem };

        }

        dropdownList.jScrollPane();

    };

    this.setItems = function( items ) {

        this.clearItems();
        this.addItems( items );
    };

    this.toggleDropdown = function() {

        if( dropdownList.height() > 0 ) {
            dropdownList.height(0);
            $(dropdownHeader).removeClass("dropdown-header-dropped");
        } else {
            dropdownList.height(150);
            $(dropdownHeader).addClass("dropdown-header-dropped");
            api.reinitialise();
            if(selected) {
                api.scrollToElement(myItems[selected].element,false,false);
            }
        }
        
    };
    
    this.itemSelected = null;

    dropdownHeader.on('click',this.toggleDropdown );

};


