(function($) {
    $(document).ready(function() {

    	function gdpr_cookie_compliance_setup_get_session( event_type ) {
    		var gdpr_uvid_session = false;
    		
    		if ( typeof( sessionStorage ) !== "undefined" ) {
    			gdpr_uvid_session = sessionStorage.getItem("gdpr_uvid");
    			if ( ! gdpr_uvid_session ) {
    				sessionStorage.setItem( "gdpr_uvid", moove_frontend_gdpr_scripts.gdpr_uvid );
    				gdpr_uvid_session = sessionStorage.getItem("gdpr_uvid");
    			}				
			}
			
			return gdpr_uvid_session;
    	}

    	function gdpr_cookie_compliance_get_cookies(){
		  	var pairs = document.cookie.split(";");
		  	var cookies = {};
		  	for (var i=0; i<pairs.length; i++){
		    	var pair = pairs[i].split("=");
		    	cookies[(pair[0]+'').trim()] = unescape(pair[1]);
		  	}
		  	return cookies;
		}

		var started = false;
		var timeout_req = 2000;
		var gdpr_timeout = 0;
		$.fn.gdpr_cookie_compliance_analytics = function(event, extras) {
			if ( moove_frontend_gdpr_scripts.stats_enabled ) {
				var gdpr_uvid_session = gdpr_cookie_compliance_setup_get_session( event );				
				if ( !started ) {
					gdpr_timeout = 0;
				} else {
					gdpr_timeout = gdpr_timeout + timeout_req;
				}
				started = true;

				if ( event === 'script_inject' ) {
		    		if ( typeof( localStorage ) !== "undefined" ) {
		    			gdpr_uvid_session = localStorage.getItem("gdpr_uvid");
		    			if ( ! gdpr_uvid_session ) {
		    				localStorage.setItem( "gdpr_uvid", moove_frontend_gdpr_scripts.gdpr_uvid );
		    				gdpr_uvid_session = sessionStorage.getItem("gdpr_uvid");
		    			} else {
		    				if ( typeof( sessionStorage ) !== "undefined" ) {
				    			_gdpr_uvid_session = sessionStorage.getItem("gdpr_uvid");
				    			if ( ! _gdpr_uvid_session ) {
				    				_gdpr_uvid_session.setItem( "gdpr_uvid", moove_frontend_gdpr_scripts.gdpr_uvid );
				    				gdpr_uvid_session = sessionStorage.getItem("gdpr_uvid");
				    			}
				    			_event 		= 'existing_session';
				    			_extras 	= '';
				    			try {
						            jQuery().gdpr_cookie_compliance_analytics_with_uvid( _event, _extras, _gdpr_uvid_session );
						        } catch(err) {
						        }
							}		    				
		    			}				
					}				
				} 
				setTimeout( function(){	
					if ( gdpr_uvid_session && event ) {
						$.post(
			              	moove_frontend_gdpr_scripts.ajaxurl,
			              	{
				                action: 	"moove_gdpr_premium_save_analytics",
				                event: 		event,
				                extras: 	extras,
				                gdpr_uvid: 	gdpr_uvid_session,
				            },
			              	function( msg ) {
			              		// console.warn(gdpr_uvid_session);
			              		if ( gdpr_timeout >= timeout_req ) {
			              			gdpr_timeout = gdpr_timeout - timeout_req;
			              		}
			              	}
			            );
					}
				}, gdpr_timeout );
				
			}
		}
		$.fn.gdpr_cookie_compliance_analytics_with_uvid = function(event, extras, uvid) {
			if ( moove_frontend_gdpr_scripts.stats_enabled ) {
				var gdpr_uvid_session = uvid;				
				if ( !started ) {
					gdpr_timeout = 0;
				} else {
					gdpr_timeout = gdpr_timeout + timeout_req;
				}
				started = true;

				setTimeout( function(){	
					if ( gdpr_uvid_session && event ) {
						$.post(
			              	moove_frontend_gdpr_scripts.ajaxurl,
			              	{
				                action: 	"moove_gdpr_premium_save_analytics",
				                event: 		event,
				                extras: 	extras,
				                gdpr_uvid: 	gdpr_uvid_session,
				            },
			              	function( msg ) {
			              		// console.warn(gdpr_uvid_session);
			              		if ( gdpr_timeout >= timeout_req ) {
			              			gdpr_timeout = gdpr_timeout - timeout_req;
			              		}
			              	}
			            );
					}
				}, gdpr_timeout );
				
			}
		}
    });
})(jQuery);
