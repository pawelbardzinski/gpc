window.onpopstate = function(event) {

	if( typeof event != 'undefined' ) {
		event.preventDefault();
	}

	$('#content').attr('rel', 'content');
	var content = $('#content')[0];
	content.url = document.location.toString();
	content.ajax_request = ajax_request;
	content.ajax_request();
};


$.ajaxSetup( {
	dataType: 'text',

	error: function(jqXHR, textStatus, errorThrown){
		alert(jqXHR);
		alert(textStatus);
		alert(errorThrown);
	}
});


ajax_request = function (event)
{
	if( typeof event != 'undefined' ) {
		event.preventDefault();
	}
	
	var self = this;

	var params = {

		async: true,
		cache: false,

		success: function(result)
		{
			if( params.url != '/topics/get_header' ) {
				header();
			}
		//	if(!on_error(result)){
				container = false;
				
				if( $(self).attr('rel') ) { 
					container = $( '#'+$(self).attr('rel') );
				}
				else {
					container = $(self).parents('.container:first');
				}

				if( !container ) return false;

				if( result.indexOf('id="dialog_content"') == -1 && $(self).attr('rel') == 'dialog_content' ) {
					dialog_hide();
					container = 'body div.container:first';
				}
				else if( result.indexOf('id="dialog_content"') > -1 ) {
					$('#dialog > div:first').hide().replaceWith( result /*.content */ );
					dialog_show();
					return;
				}
				else if( params.url != '/topics/get_header' && $(container).attr('id') == 'content' ) {

					if( typeof(window.history.pushState) != "undefined" ) {
						window.history.pushState(
							{ page: $('title').text() },
							$('title').text(),
							params.url
						);
					}
				}

				$(container).hide().replaceWith( result /*.content */ );
	//		}
		},

		error: function(result, textStatus)
		{
			header();
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
			if( typeof(this.url) == 'string' ) {
				params.type	= 'GET';
				params.url	= this.url;
			}
			else {
				return false;
			}
	}
	
	$.ajax(params);

	return true;
}

function on_error(result){

	var _on_error = false;

	if(result != undefined) {
		_on_error = true;
	}

	return _on_error;
}

function is_dialog() {
	return $('#dialog:visible');
}

function dialog_hide(event) {
	if( typeof(event) != 'undefined') {
		event.preventDefault();
	}

	$('#dialog').animate({opacity: 0}, 500, function(){$(this).css('display', 'none').css('opacity', 0)});
	$('#dialog_overall').animate({opacity: 0}, 500, function(){$(this).css('display', 'none').css('opacity', 0)});
}

function dialog_show() {
	if( $('#dialog').css('display') != "block" ) {
		$('#dialog, #dialog_overall').css('display', 'block').css('opacity', 0);
		$('#dialog_overall').animate({opacity: 0.7}, 500);
		$('#dialog').animate({opacity: 1}, 500);
	}
}

function dialog(event) {

	dialog_show();
	this.ajax_request = ajax_request;
	this.ajax_request(event);
}

function header() {

	var header = $('#header')[0];
	header.url = '/topics/get_header';
	header.ajax_request = ajax_request;
	header.ajax_request();
}

$(function(event) {
	
	$('div.navigation a.ajax_request[rel="content"], table.topics span.topic a').live('click',function(){$.scrollTo(0,$('#content'));});
	
	$('form.ajax_request').live('submit', ajax_request);
	$('a.ajax_request').live('click',ajax_request);

	$('a.dialog').live('click',dialog);
	$('form.dialog').live('submit',dialog);

	$('.dialog_close').live('click',dialog_hide);
});
