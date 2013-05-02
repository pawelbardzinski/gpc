// Obiekt pomocniczy
var ProgressRingTimer = new function() {
    
    var timerId;
    var clients = new Array();
    
    this.addClient = function(progressRing) {
        
        clients[clients.length] = progressRing;
    };
    
    this.removeClient = function(progressRing) {
        
    };
    
    this.timerHandler = function() {
        
        for( var i=0; i<clients.length; i++ ) {
            if(clients[i].running()) {
                clients[i].tick();
            }
        }
        
    };
    
    timerId = setInterval("ProgressRingTimer.timerHandler()",50);
    
};

// Progress ring
function ProgressRing( id, autostart ) {
    
    var period = 120 * 1000;
    var foregroundColor = "#007c61";
    var backgroundColor = "#e3dfd6";
    var ringWidth = 0;
    var ringWidthPercent = 50;
    
    ///////////////////////////////
     
    var id = id;
    var phase = 0;
    var startPhase = 0;
    var startTime = 0;
    var isRunning = false;
    
    var canvas = document.getElementById( id );
    if(canvas === null) {
        throw "Element with id=\"" + id + "\" not found.";
    }
    
    ///////////////////////////////
    
    this.getBackgroundColor = function() 
    {
        return backgroundColor;
    };
    
    this.setBackgroundColor = function( color ) 
    {
        backgroundColor = color;
        this.redraw();
    };
    
    this.getForegroundColor = function() 
    {
        return foregroundColor;
    };
    
    this.setForegroundColor = function( color ) 
    {
        foregroundColor = color;
        this.redraw();
    }; 
    
    this.getRingWidth = function() 
    {
        return ringWidth;
    };
    
    this.setRingWidth = function( pixels ) 
    {
        ringWidth = pixels;
        redraw;
    }; 
    
    this.getRingWidthPercent = function() 
    {
        return ringWidthPercent;
    };
    
    this.setRingWidthPercent = function( percentOfRadius ) 
    {
        ringWidthPercent = percentOfRadius;
        this.redraw();
    };
    
    this.getPeriod = function() 
    {
        return period;
    };
    
    this.setPeriod = function( p ) 
    {
        period = p;
    };

    this.getId = function() 
    {     
        return id;       
    };
    
    this.running = function() 
    {   
        return isRunning;
    };
    
    this.start = function() {

        startPhase = phase;
        startTime = (new Date()).getTime();
        isRunning = true;
       
    };

    this.stop = function() {
        
        isRunning = false;

    };
    
    this.reset = function(p) {
        if( p == undefined )
        {
        	p = 0;
        }
        phase = p;
        startPhase = phase;
        startTime = (new Date()).getTime();
        this.redraw();
        
    };
    
    this.tick = function() {
        
        var time = (new Date()).getTime();
        phase = ( startPhase +  ( time - startTime ) / period ) % 1; 
        
        this.redraw();
        
    };
    
    
    this.redraw = function() {
        
        var x = canvas.width / 2;
        var y = canvas.height / 2;
        var r = Math.min(x, y);
        var w = ringWidth;


        if (ringWidth <= 0 && ringWidthPercent >= 0)
        {
                w = r * (ringWidthPercent / 100.0);
        }
        else
        {
                w = r / 2;
        }
        
        var r2 = r - w;   
        var angle = (1.5 - 2*phase)*Math.PI;
        
        var ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle=backgroundColor;
        ctx.beginPath();
        ctx.moveTo(x,y-r2);
        ctx.lineTo(x,y-r);
        ctx.arc(x,y,r,1.5*Math.PI,-0.49999*Math.PI,true);
        ctx.lineTo(x,y-r2);        
        ctx.arc(x,y,r2,-0.49999*Math.PI,1.5*Math.PI,false);
 
        ctx.fill(); 
        
        ctx.fillStyle=foregroundColor;
        ctx.beginPath();
        ctx.moveTo(x,y-r2);
        ctx.lineTo(x,y-r);
        ctx.arc(x,y,r,1.5*Math.PI,angle,true);
        ctx.lineTo(x - Math.sin(2*phase*Math.PI)*r2,y - Math.cos(2*phase*Math.PI)*r2);        
        ctx.arc(x,y,r2,angle,1.5*Math.PI,false);
        
        ctx.fill();

    };
    
    ProgressRingTimer.addClient(this);
    this.redraw();
    
    if( autostart || autostart === undefined ) {
        this.start();
    }

}



