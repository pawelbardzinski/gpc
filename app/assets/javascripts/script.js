
$.ajaxSetup( {
	dataType: 'json',

	error: function(jqXHR, textStatus, errorThrown){
		alert(jqXHR);
		alert(textStatus);
		alert(errorThrown);
	}
});


ajax_request = function (event)
{
	event.preventDefault();
	var self = this;

	var params = {

		async: true,
		cache: false,

		success: function(result)
		{
			if(!on_error(result)){
				container = false;
				
				if( $(self).attr('rel') ) { 
					container = $( '#'+$(self).attr('rel') );
				}
				else {
					container = $(self).parents('.container:first');
				}

				if( !container ) return false;

				$(container).hide().replaceWith( result.content );
			}
		},

		error: function(result, textStatus)
		{
			if( textStatus == 'error' && result.status == 0 ) {
				return;
			}
		}
	};

	switch( self.tagName.toLowerCase() )
	{
		case 'select':
			self = $(self).parents('form:first');
		case 'form':
			params.url	= $(self).attr('action');
			params.type	= 'POST';
			params.data	= $(self).serialize();
			break;

		case 'a':
			params.type	= 'GET';
			params.url	= $(self).attr('href');
			break;

		default:
			return false;
	}
	
	$.ajax(params);

	return true;
}

function on_error(result){

	var _on_error = false;

	if(result.error != undefined) {
		_on_error = true;
	}

	return _on_error;
}

$(function(event) {
	$('form.ajax_request').submit(ajax_request);
	$('a.ajax_request').click(ajax_request);
});