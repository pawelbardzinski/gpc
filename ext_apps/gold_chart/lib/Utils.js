getDistance = function(x, x0, y, y0){
    return Math.sqrt( Math.pow(x-x0,2) + Math.pow(y-y0,2));
};

parseCurrency = function(csv)
{
    var list = [];
    var currency;
    for( var i =0; i < csv.length; i++)
    {
        var row = csv[i]
        if(row.length == 1)
        {
            currency = row[0];
            list[currency] = [];
        }
        else
        {
            list[currency].push(row);
        }
    }
    return list;
}

formatTime = function(time)
{
    if( time < 0 ) time = 0;
    var min = Math.floor(time / 60);
    var sec = time % 60;
        min = getNumberWithZero(min);
        sec = getNumberWithZero(sec);
    return min + ":" + sec;
}

getNumberWithZero   = function(val)
{
    if( val < 10 )
    {
        return "0"+val;
    }
    else return val;
}

formatPrice = function(price){
    price = Math.round(price*100)/100;
    
    var integer = Math.floor(price);
    var rest = Math.round( (price - integer)*100 );
	if( rest < 10 ){
        rest = "0" + rest;
    }
    
    var text = integer.toString();
    var len = text.length;
    var mod = 3 - len % 3;
    
    var res = "";
    for ( var i = 0; i < len; i++ )
    {
    	if( (i+mod) % 3 == 0 && i != 0){
    		res += ",";
    	}
    	res += text.charAt(i);
    }

    return res + "."+ rest ;
}

parseCSV = function(text)
{
    var csvRows = text.split("\n");
    var csv = [];
    for ( var i =0; i < csvRows.length; i++)
    {
        csv[i] = csvRows[i].split(",");
    }
    return csv;
}