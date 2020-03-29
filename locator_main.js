//this line prevents conflict with other versions of jquery
var $loc = $.noConflict(true);

/* configuration variable for Google Analytics performance tracking */
var sourceTag = "Heroku";

if (location.protocol === 'https:') {
    var loc_system_url = 'https://productlocator.cbrands.com/';
	var loc_api_url = 'https://api.cbrands.com/pl/';
} else {
    var loc_system_url = 'http://productlocator.cbrands.com/';
	var loc_api_url = 'http://api.cbrands.com/pl/';
}

var loc_mailer_url = 'http://splashpage.cbrands.com/mail/mailer.php';
var loc_api_key = 'D95AA8C1B9073588E043AB00E40AC579';
var loc_result_display_limit = 10;
var loc_max_results = 50;

/* defaults */
var loc_size = 'responsive';
var loc_brand = false;
var loc_varietal = false;
var loc_region = false;
var loc_bottle = false;
var loc_subbrand_dropdown = false;
var loc_region_dropdown = false;
var loc_bottle_dropdown = true;
var loc_small_break = 519;
var loc_medium_break = 959;
var loc_miles_default = 25;
var loc_product_label = 'Constellation Products';
var loc_logo_display = false;
var loc_subbrand_required = false;
var loc_varietal_required = true;
var loc_analytics = true; //set to false if you do not want to track google event analytics 
var loc_type = 'instore';
var loc_legal_age = true;
var loc_small_map = false;

var loc_brand_label = 'Select a Brand';
var loc_subbrand_label = 'Select a Sub-Brand';
var loc_varietal_label = 'Select a Varietal';
var loc_region_label = 'Select an Appellation/Region';
var loc_bottle_label = 'Select a Bottle Size';

var loc_brand_rename = [];
var loc_varietal_rename = [];
var loc_region_rename = [];
var loc_bottle_rename = [];
var loc_subbrand_rename = [];

var loc_show_restricted = false;

/* invite variables */
var loc_invite = false;
var loc_invite_key = false; //this is the chosen location key associated with the search results
var loc_invite_brand_message = 'Join me at [location].';
var loc_invite_custom_message = '';
var loc_invite_email_subject = 'Wine Invitation';
var loc_invite_facebook_appid = '469314036492192';
var loc_invite_facebook_header = 'Wine Invitation';

/* script variables */
var loc_brand_name = 'none';
var loc_address_input = false; //the full address is stored here for analytics if used instead of current location
var loc_brands = false; //holds the list of brands from the API
var loc_subbrands = false; //holds the list of sub-brands from the API
var loc_wines = false; //holds the list of varietals from the API
var loc_regions = false; //holds the list of regions from the API
var loc_bottles = false; //holds the bottle sizes from the API
var loc_age_fail = false; //use to determine if the user should be sent to underage website

/* dropdown field association variables */
var loc_subbrand_wines = false;
var loc_subbrand_regions = false;
var loc_wine_regions = false;
var loc_wine_bottles = false;
var loc_region_bottles = false;

/* error messages */
var loc_error_text = new Array();
loc_error_text['locator_brand'] = 'Choose a brand.';
loc_error_text['locator_varietal'] = 'Choose a varietal.';
loc_error_text['locator_subbrand'] = 'Choose a sub-brand.';
loc_error_text['locator_bottle'] = 'Choose a bottle size.';
loc_error_text['locator_address'] = 'Set an address.';
loc_error_text['locator_miles'] = 'Set search mileage.';
loc_error_text['locator_type'] = 'Choose a type.';
loc_error_text['geo_error1'] = 'Geolocation permission denied.';
loc_error_text['geo_error2'] = 'Position unavailable.';
loc_error_text['geo_error3'] = 'Geolocation timeout.';
loc_error_text['google_geo_error'] = 'Location not found.';
loc_error_text['no_results'] = 'We are unable to provide the information requested at this time. Please contact us directly at 1-888-659-7900 so that we can personally assist you with this information.  Business days: Monday - Friday - 9am - 8pm EST';
loc_error_text['no_api'] = 'There was an error connecting to our system.';
loc_error_text['invite_sender_name'] = 'You must use your name.';
loc_error_text['invite_sender_email'] = 'You must use your email.';
loc_error_text['invite_recipients'] = 'You must use an email and name for the recipients.';
loc_error_text['locator_legalage'] = 'You must be 21 or older to search.';

//the following variables tracks the screen status of each viewport type. They are used to display the correct sections of html.
var loc_current_size; //this tracks the current size that is assigned to the locator
var loc_display = new Array();
loc_display['large'] = 'form';
loc_display['medium'] = 'form';
loc_display['small'] = 'form';
loc_display['widget'] = 'form';
loc_display['narrow'] = 'form';

//store the search results in this array
var loc_search_results = new Array();

//the current search page
var loc_current_page = 0;

//The following is the variable version of locator_display.html. Including it as a variable saves an ajax request
//the original file with approriate spacing can be found in locator_display.html
var loc_display_html = '<div class="locator_search_header"><h1>WHERE TO BUY</h1></div><div class="locator_form"><div class="locator_logo"></div><div class="locator_clear"></div><hr class="locator_hr_first" /><p>Use the form below to search for <span class="locator_product">NGBD products</span> near you</p><div class="locator_form_container"><select name="locator_brand" id="locator_brand" class="locator_brand"></select><select name="locator_subbrand" id="locator_subbrand" class="locator_subbrand"></select><select name="locator_varietal" id="locator_varietal" class="locator_varietal"></select><select name="locator_region" id="locator_region" class="locator_region"></select><select name="locator_bottle" id="locator_bottle" class="locator_bottle"></select></div><div class="locator_clear"></div><hr/><p>Enter your address OR use your current location. Enter miles to search.</p><div class="locator_form_container"><div class="locator_location_left"><label for="locator_address" class="locator_address_label">Location</label><input type="text" name="locator_address" id="locator_address" class="locator_address"><input type="checkbox" name="locator_current" id="locator_current" class="locator_current" /><label for="locator_current" class="locator_current_label">Use My Current Location</label></div><div class="locator_location_right"><label for="locator_miles" class="locator_miles_label">Miles to Search</label><input type="text" name="locator_miles" id="locator_miles" class="locator_miles"></div></div><div class="locator_clear"></div><hr/><p>You may search for wines available at a retail store or restaurant</p><div class="locator_form_container"><div class="locator_location_left locator_type"><span class="locator_type_group"><input type="radio" name="locator_type" id="locator_store" class="locator_store" value="store" /><label for="locator_store" class="label_inline">In Store</label></span> <span class="locator_type_group"><input type="radio" name="locator_type" id="locator_restaurant" class="locator_restaurant" value="restaurant" /><label for="locator_restaurant" class="label_inline">Restaurant/bar</label></span></div><div class="locator_location_right"><input type="checkbox" name="locator_legalage" id="locator_legalage"  class="locator_legalage"/><label for="locator_legalage" class="locator_legalage_label">I am 21 years of age or older.</label><input type="button" value="Search" class="locator_search"></div><ul class="locator_errors"></ul><div class="locator_loading"></div></div><div class="locator_clear"></div></div><div class="locator_results_header"><h1>SEARCH RESULTS</h1><span>Please find results below. Go back to the search form to revise your search.</span><a class="locator_header_search"></a></div><div class="locator_widget_wrapper"><div class="locator_map_heading"><h1>SEARCH RESULTS</h1><p class="locator_breadcrumbs"></p><p>Please find search results below. Use the search form to revise your search.</p></div><div class="locator_map"><div class="locator_inner_map"></div></div><div class="locator_results"><h1>SEARCH RESULTS</h1><p class="locator_breadcrumbs"></p><p class="locator_results_instructions">Please find search results below. Use the search form to revise your search.</p><div class="locator_pages"></div><ul class="locator_locations"></ul><div class="locator_pages"></div></div></div><div class="locator_navigation"><ul class="locator_navigation_results locator_mobile_nav"><li class="locator_navigation_button"><a class="locator_nav_search"></a></li></ul><ul class="locator_navigation_research locator_mobile_nav"><li class="locator_navigation_button"><a class="locator_nav_map"></a></li></ul><ul class="locator_navigation_invite locator_mobile_nav"><li class="locator_navigation_button"><a class="locator_nav_back"></a></li></ul><ul class="locator_navigation_invite_form locator_mobile_nav"><li class="locator_navigation_button"><a class="locator_nav_back"></a></li></ul><ul class="locator_navigation_invite_message locator_mobile_nav"><li class="locator_navigation_button"><a class="locator_nav_back"></a></li></ul><ul class="locator_narrow_search locator_narrow_nav"><li class="locator_navigation_button"><a class="locator_nav_map"></a></li><li class="locator_navigation_button"><a class="locator_nav_results"></a></li></ul><ul class="locator_narrow_results locator_narrow_nav"><li class="locator_navigation_button"><a class="locator_nav_search"></a></li><li class="locator_navigation_button"><a class="locator_nav_map"></a></li></ul><ul class="locator_narrow_map locator_narrow_nav"><li class="locator_navigation_button"><a class="locator_nav_search"></a></li><li class="locator_navigation_button"><a class="locator_nav_results"></a></li></ul></div>';

var loc_invite_html = '<div class="locator_invite_header"><h1>INVITE FRIENDS</h1></div><div class="locator_invite"><ul class="locator_invite_links"><li class="locator_invite_email"><a>Send Email Invitation</a></li><li class="locator_invite_facebook"><a target="facebook_share">Share on Facebook</a></li><li class="locator_invite_twitter"><a target="twitter_share">Share on Twitter</a></li></ul><div class="locator_invite_container"><div class="locator_invite_form"><ul class="locator_invite_errors"></ul><label>Sender</label><input type="text" class="locator_invite_sender_name locator_invite_name" value="Name"><input type="text" class="locator_invite_sender_email locator_invite_email" value="Email Address"><label>Recipients</label><input type="text" class="locator_invite_recipient1_name locator_invite_name" value="Name"><input type="text" class="locator_invite_recipient1_email locator_invite_email" value="Email Address"><div class="locator_invite_recipients"></div><input type="button" class="locator_invite_button locator_invite_add_recipient" value="ADD ANOTHER RECIPIENT"><label>Custom Message</label><textarea class="locator_invite_custom_message"></textarea><input type="button" class="locator_invite_button locator_invite_full_button locator_invite_send" value="SEND INVITATION"><input type="button" class="locator_invite_button locator_invite_full_button locator_invite_cancel" value="CANCEL INVITATION"><input type="button" class="locator_invite_button locator_invite_preview locator_invite_small_button" value="PREVIEW INVITATION"></div><div class="locator_invite_message">To <span class="locator_invite_preview_recipient">Denise</span>,<br/><br/><span class="locator_invite_preview_message">Join me at Restaurant One to enjoy Mark West Wines.</span><br/><br/><span class="locator_invite_preview_name">Restaurant One</span><br/><span class="locator_invite_preview_address">123 Market Street</span><br/><span class="locator_invite_preview_city">San Francisco</span>, <span class="locator_invite_preview_state">CA</span> <span class="locator_invite_preview_zip">94704</span><br/><br/><span class="locator_invite_preview_custom">I’ll be there at 6pm. Let me know if you can’t make it.</span><br/><br/>From,<br/><span class="locator_invite_preview_sender">Waz</span><input type="button" class="locator_invite_button locator_edit_invitation locator_invite_small_button" value="EDIT INVITATION"><input type="button" class="locator_invite_button locator_invite_small_button locator_invite_send" value="SEND INVITATION"></div><div class="locator_loading"></div></div></div>';

$loc(document).ready(function(){
	
	//begin app initialization
	if ($loc('.locator').is('*')){
		//responsive code
		
		$loc(window).resize(function(){
			if (loc_size == 'responsive'){
				loc_update_size($loc(this).width());
			} else {
				loc_map_resize();
			}
		});
	
		//if default brand is not set, get the brand list and populate the dropdown
		//each function calls the init_display function on completion which builds the html
		if (loc_brand === false){
			set_brand_list();
		} else {
			set_item_list();
		}
	}
	//end app initialization
	
	//on use my current location check disable or enable the address input field
	$loc('body').on('change', '.locator_current', function(){
		if ($loc(this).is(':checked')){
			$loc('.locator_address').val('');
			$loc('.locator_address').prop('disabled', true);
		} else {
			$loc('.locator_address').prop('disabled', false);
			$loc('.locator_address').focus();
		}
	});
	
	//on brand select change, update the varietal, regions, and subbrands list
	$loc('body').on('change', '.locator_brand', function(){
		brand_id = $loc(this).val();
		if (brand_id == '0'){
			loc_brand_name = 'none';
		} else {
			loc_brand_name = loc_brands[brand_id]; //set the brand name for analytics
		}
		track_analytics_event('Brand', loc_brand_name); //track the brand change
		
		if (brand_id == '0'){
			loc_subbrands = false;
			loc_wines = false;
			loc_regions = false;
			loc_bottles = false;
			
			loc_subbrand_wines = false;
			loc_subbrand_regions = false;
			loc_wine_regions = false;
			loc_wine_bottles = false;
			loc_region_bottles = false;
			
			update_dropdowns();
		} else {
			set_item_list();
		}
	});
	
	$loc('body').on('change', '.locator_subbrand, .locator_varietal, .locator_region', function(){
		filter_dropdowns();
	});
	
	//track in analytics the change in subbrand
	$loc('body').on('change','.locator_subbrand', function(){
		subbrand_id = $loc(this).val();
		subbrand_name = $loc('option[value="'+subbrand_id+'"]', this).html();
		track_analytics_event('Sub-Brand', subbrand_name);
	});
	
	//track in analytics the change in varietal
	$loc('body').on('change','.locator_varietal', function(){
		varietal_id = $loc(this).val();
		varietal_name = $loc('option[value="'+varietal_id+'"]', this).html();
		track_analytics_event('Varietal', varietal_name);
	});
	
	//track in analytics the change in region
	$loc('body').on('change','.locator_region', function(){
		region_id = $loc(this).val();
		region_name = $loc('option[value="'+region_id+'"]', this).html();
		track_analytics_event('Appellation', region_name);
	});
	
	//track in analytics the change in bottle size
	$loc('body').on('change','.locator_bottle', function(){
		bottle_id = $loc(this).val();
		bottle_name = $loc('option[value="'+bottle_id+'"]', this).html();
		track_analytics_event('Format', bottle_name);
	});
	
	//track in analytics the change in current location checkbox
	$loc('body').on('change','.locator_current', function(){
		track_analytics_event('Current-Location', 'Checked');
	});
	
	//track in analytics the change in In-Store
	$loc('body').on('change','.locator_store', function(){
		track_analytics_event('In-Store', 'Checked');
	});
	
	//track in analytics the change in In-Store
	$loc('body').on('change','.locator_restaurant', function(){
		track_analytics_event('Restaurant', 'Checked');
	});
	
	//track in analytics the change in current location checkbox
	$loc('body').on('change','.locator_legalage', function(){
		track_analytics_event('Age', 'Checked');
	});
	
	//click of the search
	$loc('body').on('click', '.locator_search', function(){
		set_loading(true);
		
		loc_clear_errors();
		
		
		if (loc_check_form() === false){
			set_loading(false)
			loc_set_errors();
		} else {
			//get lat and lng
			loc_address_input = false;
			if ($loc('.locator_address').val() == ''){
				//get lat and lng with browser geolocation
				loc_initiate_geolocation();
			} else {
				//get lat and lng with google geocoding
				loc_google_geocode();
			}
		}
	});
	
	//click a link in the pagination section
	$loc('body').on('click', '.locator_pages a', function(){
		track_analytics_event('Change-Page', 'Clicked');
		
		new_page = $loc(this).attr('rel');
		if (new_page == 'previous'){
			new_page = loc_current_page - 1;
		} else if (new_page == 'next') {
			new_page = loc_current_page + 1;
		} else {
			new_page = parseInt(new_page) - 1;
		}
		
		if (new_page < 0){ new_page = 0; }
		if (new_page > Math.floor(loc_search_results.length / loc_result_display_limit)){ new_page = Math.floor(loc_search_results.length / loc_result_display_limit); }
			
		loc_populate_results(new_page);
		loc_update_pagination();
		loc_update_map_markers();
	});
	
	//return to search button in the navigation section of the mobile
	$loc('body').on('click', '.locator_mobile_nav .locator_nav_search', function(){
		loc_screen_action('research');
	});
	
	//return to map button in the navigation section of the mobile
	$loc('body').on('click', '.locator_mobile_nav .locator_nav_map', function(){
		loc_screen_action('search');
	});
	
	//return to search button in the navigation section of the narrow
	$loc('body').on('click', '.locator_narrow_nav .locator_nav_search', function(){
		loc_screen_action('research');
	});
	
	//return to results button in the navigation section of the narrow
	$loc('body').on('click', '.locator_narrow_nav .locator_nav_results', function(){
		loc_screen_action('search');
	});
	
	//return to map button in the navigation section of the narrow
	$loc('body').on('click', '.locator_narrow_nav .locator_nav_map', function(){
		loc_screen_action('map');
	});
	
	//return to search button in the widget header
	$loc('body').on('click', '.locator_header_search', function(){
		loc_screen_action('research');
	});
	
	//open window with directions
	$loc('body').on('click', '.locator_directions', function(){
		
	 	rel = $loc(this).attr('rel').split('***');
		
		//label = build_analytics_label(rel[1]);
		track_analytics_event('Directions', rel[2]+': '+rel[1]);
		
		//go to the google maps url
		window.open(rel[0]);
	});
	
	
	//trigger the invite panel
	$loc('body').on('click', '.locator_invite_trigger', function(){
		
	 	rel = $loc(this).attr('rel').split('***');
		
		loc_invite_key = rel[0];
		
		track_analytics_event('Invite', rel[2]+': '+rel[1]);
		
		populate_invite();
		
		loc_screen_action('invite');
	});
	
	//move to the invite form on mobile
	$loc('body').on('click', '.locator_small .locator_invite_email, .locator_narrow .locator_invite_email', function(){
		loc_screen_action('invite_form');
	});
	
	//move to the invite confirmation on mobile
	$loc('body').on('click', '.locator_small .locator_invite_preview, .locator_narrow .locator_invite_preview', function(){
		loc_screen_action('invite_message');
	});
	
	//move to the invite form on mobile
	$loc('body').on('click', '.locator_edit_invitation', function(){
		loc_screen_action('invite_form');
	});
	
	//move to the invite form on mobile
	$loc('body').on('click', '.locator_invite_cancel', function(){
		loc_screen_action('search');
	});
	
	//add new fields for another recipient
	$loc('body').on('click', '.locator_invite_add_recipient', function(){
		loc_invite_add_recipient();
	});
	
	$loc('body').on('keyup', '.locator_invite_recipient1_name, .locator_invite_custom_message, .locator_invite_sender_name', function(){
		update_invite_preview();
	});
	
	
	
	
	//mobile button - go back when on the invite page
	$loc('body').on('click', '.locator_navigation_invite a', function(){
		loc_screen_action('search');
	});
	
	//mobile button - go back when on the invite form page
	$loc('body').on('click', '.locator_navigation_invite_form a', function(){
		loc_screen_action('invite');
	});
	
	//mobile button - go back when on the invite message page
	$loc('body').on('click', '.locator_navigation_invite_message a', function(){
		loc_screen_action('invite_form');
	});
	
	
	//share on facebook
	$loc('body').on('click', '.locator_invite_facebook a', function(){
		track_analytics_event('Invite-Facebook', 'Clicked');
		facebook_build_share();
	});
	
	//share on twitter
	$loc('body').on('click', '.locator_invite_twitter a', function(){
		track_analytics_event('Invite-Twitter', 'Clicked');
		twitter_build_share();
	});
	
	//clear name on input field
	$loc('body').on('click', '.locator_invite_name', function(){
		/*
		value = $loc(this).val();
		if (value == 'Name'){
			$loc(this).val('');
		}
		*/
	});
	
	//reset name on input field
	$loc('body').on('blur', '.locator_invite_name', function(){
		/*
		value = $loc(this).val();
		if (value == ''){
			$loc(this).val('Name');
		}
		*/
	});
	
	//clear email on input field
	$loc('body').on('click', '.locator_invite_email', function(){
		/*
		value = $loc(this).val();
		if (value == 'Email Address'){
			$loc(this).val('');
		}
		*/
	});
	
	//reset email on input field
	$loc('body').on('blur', '.locator_invite_email', function(){
		/*
		value = $loc(this).val();
		if (value == ''){
			$loc(this).val('Email Address');
		}
		*/
	});
	
	//locator send invite
	$loc('body').on('click','.locator_invite_send', function(){
		validate_invite();
	});
	
});

//get the brands from the API and convert it to the loc_brands variable
function set_brand_list(){
	url = loc_api_url+'brands?apiKey='+loc_api_key;
	//url = loc_system_url+'demo_data/locator_brands.php';
	
	//start time for analytics
	var startTime = new Date().getTime();

	$loc.ajax({
	  url: url,
		async: true,
		dataType: 'xml',
		cache: 'false',
		error: function(request, status, error){
			loc_clear_errors();
			form_errors[form_errors.length] = 'no_api';
			loc_set_errors();
		}
	}).done(function(data) {
		//end time for analytics
		var timeSpent = new Date().getTime() - startTime;
				
		//track timing to GA
		track_analytics_timing(sourceTag, 'brands', timeSpent);
		
		//take the brand data and convert it the loc_brands storage for later use
		brands = new Object;
		$loc(data).find('plBrand').each(function(i, e){
			name = $loc(e).find('brandDsc').text();
			id = $loc(e).find('brandCd').text();
			brands[id] = name;
		});
		loc_brands = brands;
		
		//show the html display
		init_display();
	});
}

function sort_object(a, b){
	return a - b;
}

//get the items from the API and convert it to the respective variables for later use
function set_item_list(){
	
	if (loc_brand == false){
		brand_id = $loc('.locator_brand').val();
	} else {
		brand_id = loc_brand;
	}
	
	url = loc_api_url+'brand/'+brand_id+'?apiKey='+loc_api_key;
	
	//start time for analytics
	var startTime = new Date().getTime();
	
	$loc.ajax({
	  url: url,
		async: true,
		dataType: 'xml',
		cache: 'false',
		error: function(){
			loc_clear_errors();
			form_errors[form_errors.length] = 'no_api';
			loc_set_errors();
		}
	}).done(function(data) {
		//end time for analytics
		var timeSpent = new Date().getTime() - startTime;
		
		//track timing to GA
		track_analytics_timing(sourceTag, 'brand', timeSpent);
		
		//take the brand data and convert it the storage variables
		subbrands = new Object;
		wines = new Object;
		regions = new Object;
		bottles = new Object;
		
		subbrand_wines = new Object;
		subbrand_regions = new Object;
		wine_regions = new Object;
		wine_bottles = new Object;
		region_bottles = new Object;
		
		$loc(data).find('plBrandDetails').each(function(i, e){
			loc_brand_name = $loc(e).find('brandDsc').text(); //set the brand name for analytics
			//populate the dropdown arrays
			subbrand_name = $loc(e).find('subBrandDsc').text();
			subbrand_id = $loc(e).find('subBrandCd').text();
			subbrands[subbrand_id] = subbrand_name;
			
			wine_name = $loc(e).find('varietalBlendDsc').text();
			wine_id = $loc(e).find('varietalBlendCd').text();
			wines[wine_id] = wine_name;
			
			region_name = $loc(e).find('appellationDsc').text();
			regions[region_name] = region_name;
			
			bottle_name = $loc(e).find('itemSizeDsc').text();
			bottles[bottle_name] = bottle_name;
			
			//populate the field association arrays
			if (subbrand_wines[subbrand_id] === undefined){
				subbrand_wines[subbrand_id] = new Array();
			}
			if ($loc.inArray(wine_id, subbrand_wines[subbrand_id]) === -1){
				subbrand_wines[subbrand_id].push(wine_id);
			}
			
			if (subbrand_regions[subbrand_id] === undefined){
				subbrand_regions[subbrand_id] = new Array();
			}
			if ($loc.inArray(region_name, subbrand_regions[subbrand_id]) === -1){
				subbrand_regions[subbrand_id].push(region_name);
			}
			
			if (wine_regions[wine_id] === undefined){
				wine_regions[wine_id] = new Array();
			}
			if ($loc.inArray(region_name, wine_regions[wine_id]) === -1){
				wine_regions[wine_id].push(region_name);
			}
			
			if (wine_bottles[wine_id] === undefined){
				wine_bottles[wine_id] = new Array();
			}
			if ($loc.inArray(bottle_name, wine_bottles[wine_id]) === -1){
				wine_bottles[wine_id].push(bottle_name);
			}
			
			if (region_bottles[region_name] === undefined){
				region_bottles[region_name] = new Array();
			}
			if ($loc.inArray(bottle_name, region_bottles[region_name]) === -1){
				region_bottles[region_name].push(bottle_name);
			}
			
		});
		
		loc_subbrands = subbrands;
		loc_wines = wines;
		loc_regions = regions;
		loc_bottles = bottles;
		
		loc_subbrand_wines = subbrand_wines;
		loc_subbrand_regions = subbrand_regions;
		loc_wine_regions = wine_regions;
		loc_wine_bottles = wine_bottles;
		loc_region_bottles = region_bottles;
		
		//show the html display
		init_display();
		
		update_dropdowns();
	});
}

//load locator_display.html and modify based on configuration variables
function init_display(){
	if ($loc('.locator').html() == '') //if the locator html has already been built don't continue with this function
	{
		
		$loc('.locator').css('opacity',0);
		$loc('.locator').append(loc_display_html);
		
		if (loc_invite === true)
		{
			$loc('.locator').prepend(loc_invite_html);
		}

		//set the size
		if (loc_size == 'responsive'){
			loc_update_size($loc(window).width());
		} else {
			loc_current_size = loc_size;
			$loc('.locator').addClass('locator_'+loc_size);
		}
		

		loc_screen_action('form');

		//set the legal age field
		if (loc_legal_age == false){
			$loc('.locator_legalage').remove();
			$loc('.locator_legalage_label').remove();
		}

		//update the product label
		$loc('.locator_product').html(loc_product_label);
	
		//update the dropdown fields
		update_dropdowns();

		//update the starting miles
		$loc('.locator_miles').val(loc_miles_default);

		//start the map
		loc_map_initialize();
	
		//if geolocation is not an option, remove the current location checkbox
		if ('geolocation' in navigator){
			$loc('.locator_address').val('');
			$loc('.locator_address').prop('disabled', true);
			$loc('.locator_current').prop('checked', true);
		} else {
			$loc('.locator_current').css('display','none');
			$loc('.locator_current_label').css('display','none');
		}
	
		if (loc_logo_display == false){
			$loc('.locator_logo').css('display','none');
			$loc('.locator_hr_first').css('display','none');
		}
	
		//set the default type
		if (loc_type == 'restaurant'){
			$loc('.locator_restaurant').prop('checked', true);
		} else {
			$loc('.locator_store').prop('checked', true);
		}
	
		//animate the display
		$loc('.locator').animate({opacity: 1}, 1000);
	}
}

//turn on or off the loading wheel
function set_loading(status){
	if (status == true){
		$loc('.locator_loading').css('display','block');
	} else {
		$loc('.locator_loading').css('display','none');
	}
}

function sort_dropdown(selector) {
	if ($loc(selector).length) {
		//get the selected value
		var myselect = $loc(selector);
		selected_index = myselect[0].selectedIndex;
		selected_value = $loc(selector).val();

		var foption = $loc(selector + ' option:first');
		var soptions = $loc(selector + ' option:not(:first)').sort(function(a, b) {
			return a.text.toLowerCase() == b.text.toLowerCase() ? 0 : a.text.toLowerCase() < b.text.toLowerCase() ? -1 : 1
		});
		$loc(selector).html(soptions).prepend(foption);              

		if ($loc(selector + ' option').size() > 0){
			list_item = $loc('option[value='+selected_value+']', selector);
			index = $loc('option', selector).index(list_item);
			myselect[0].selectedIndex = index;
		}
	}
}

function get_option_html(array, key, value, select){
	name = value;
	for (var z in array){
		if (value == array[z][0]){
			name = array[z][1];
		}
	}

	if (name == false){
		option = '';
	} else {
		selected = '';
		if (select == true){
			selected = 'selected="selected"';
		}
		option = '<option value="'+key+'" '+selected+'>'+name+'</option>';
	}

	return option;
}


//updates the dropdown content based on available data
function update_dropdowns(){
	//if the brand list is not set to false, it means it is filled. Populate the dropdown accordingly, or remove the item.
	if ($loc('.locator_brand').html() == ''){
		if (loc_brands !== false){
			$loc('.locator_brand').html('<option value="0">'+loc_brand_label+'</option>');
			for(var a in loc_brands){
				$loc('.locator_brand').append(get_option_html(loc_brand_rename, a, loc_brands[a], false));
			}
			sort_dropdown('.locator_brand');
		} else {
			$loc('.locator_brand').remove();
		}
	}
		
	//if the subbrand dropdown should exist populate it, otherwise remove it
	if (loc_subbrand_dropdown !== false){
		//update the subbrand dropdown if the subbrand list is not set to false, otherwise disable the field
		$loc('.locator_subbrand').html('');
		$loc('.locator_subbrand').html('<option value="0">'+loc_subbrand_label+'</option>');
		if (loc_subbrands !== false){
			$loc('.locator_subbrand').prop('disabled', false);	
			for(var a in loc_subbrands){
				$loc('.locator_subbrand').append(get_option_html(loc_subbrand_rename, a, loc_subbrands[a], false));
			}
			sort_dropdown('.locator_subbrand');
		} else {
			$loc('.locator_subbrand').prop('disabled', true);	
		}
	} else {
		$loc('.locator_subbrand').remove();
	}
	
	//update the varietal dropdown list if the wine list variable is not set to false, otherwise disable the field
	$loc('.locator_varietal').html('');
	$loc('.locator_varietal').html('<option value="0">'+loc_varietal_label+'</option>');
	if (loc_wines !== false){
		$loc('.locator_varietal').prop('disabled', false);	
		for(var a in loc_wines){
			select = false;
			if (loc_varietal == a){
				select = true;
			}
			$loc('.locator_varietal').append(get_option_html(loc_varietal_rename, a, loc_wines[a], select));
		}
		sort_dropdown('.locator_varietal');
	} else {
		$loc('.locator_varietal').prop('disabled', true);	
	}
	
	//if the region dropdown should exist populate it, otherwise remove it
	if (loc_region_dropdown !== false){
		//update the region dropdown if the region list is not set to false, otherwise disable the field
		$loc('.locator_region').html('');
		$loc('.locator_region').html('<option value="0">'+loc_region_label+'</option>');
		if (loc_regions !== false){
			$loc('.locator_region').prop('disabled', false);	
			for(var a in loc_regions){
				select = false;
				if (loc_region == a){
					select = true;
				}
				$loc('.locator_region').append(get_option_html(loc_region_rename, a, loc_regions[a], select));
			}
			sort_dropdown('.locator_region');
		} else {
			$loc('.locator_region').prop('disabled', true);	
		}
	} else {
		$loc('.locator_region').remove();
	}
	
	//if the bottle dropdown should exist populate it, otherwise remove it
	if (loc_bottle_dropdown !== false){
		//update the bottle dropdown list if the bottle list variable is not set to false, otherwise disable the field
		$loc('.locator_bottle').html('');
		$loc('.locator_bottle').html('<option value="0">'+loc_bottle_label+'</option>');
		if (loc_bottles !== false){
			$loc('.locator_bottle').prop('disabled', false);	
			for(var a in loc_bottles){
				select = false;
				if (loc_bottle == a){
					select = true;
				}
				$loc('.locator_bottle').append(get_option_html(loc_bottle_rename, a, loc_bottles[a], select));
			}
			sort_dropdown('.locator_bottle');
		} else {
			$loc('.locator_bottle').prop('disabled', true);		
		}
	} else {
		$loc('.locator_bottle').remove();
	}
}

function filter_dropdowns(){
	
	//filter the wine list based on the subbrand_id
	subbrand_id = $loc('.locator_subbrand').val();
	
	if (subbrand_id != undefined){
		
		selected_wine = $loc('.locator_varietal').val();
		$loc('.locator_varietal').html('');
		$loc('.locator_varietal').html('<option value="0">Select a Varietal</option>');
		for(var a in loc_wines){
			if ((subbrand_id == '0') || ($loc.inArray(a, loc_subbrand_wines[subbrand_id]) !== -1)){
				select = false;
				if (selected_wine == a){
					select = true;
				}
				$loc('.locator_varietal').append(get_option_html(loc_varietal_rename, a, loc_wines[a], select));
			}
		}
	}
	
	//filter the regions based on the subbrand & varietal options
	wine_id = $loc('.locator_varietal').val();
	wine_array = new Array();
	if (wine_id != 0){
		wine_array.push(wine_id);
	} else {
		$loc('.locator_varietal option').each(function(){
			wine_id = $loc(this).val();
			wine_array.push(wine_id);
		});
	}
	selected_region = $loc('.locator_region').val();
	$loc('.locator_region').html('');
	$loc('.locator_region').html('<option value="0">Select an Appellation/Region</option>');
	for( var j = 0; j < wine_array.length; j++) {
		wine_id = wine_array[j];
		//populate the regions
		nextWineArray = loc_wine_regions[wine_id];
		for( var i=0; i < nextWineArray.length; i++) {
			if (! $loc('.locator_region option[value="'+nextWineArray[i]+'"]').is('*')){
				select = false;
				if (selected_region == nextWineArray[i]){
					select = true;
				}

				$loc('.locator_region').append(get_option_html(loc_region_rename, nextWineArray[i], nextWineArray[i], select));
			}
		}
	}
	sort_dropdown('.locator_region');
	
	//remove the regions based on the subbrand chosen
	subbrand_id = $loc('.locator_subbrand').val();
	if (subbrand_id != undefined){
		subbrand_array = new Array();
		if (subbrand_id != 0){
			subbrand_array.push(subbrand_id);
		} else {
			$loc('.locator_subbrand option').each(function(){
				subbrand_id = $loc(this).val();
				subbrand_array.push(subbrand_id);
			});
		}
		
		region_array = new Array();
		for (var a in subbrand_array){
			subbrand_id = subbrand_array[a];
			for (var b in loc_subbrand_regions[subbrand_id]){
				if ($loc.inArray(loc_subbrand_regions[subbrand_id][b], region_array) === -1){
					region_array.push(loc_subbrand_regions[subbrand_id][b]);
				}
			}
		}
		
		//remove the bottles that are not in the bottle array
		$loc('.locator_region option').each(function(){
			region_id = $loc(this).val();
			if (region_id != '0'){
				if ($loc.inArray(region_id, region_array) === -1){
					$loc(this).remove();
				}
			}
		});
	}
	
	//filter the bottles based on the varietal options
	wine_id = $loc('.locator_varietal').val();
	wine_array = new Array();
	if (wine_id != 0){
		wine_array.push(wine_id);
	} else {
		$loc('.locator_varietal option').each(function(){
			wine_id = $loc(this).val();
			wine_array.push(wine_id);
		});
	}
	selected_bottle = $loc('.locator_bottle').val();
	$loc('.locator_bottle').html('');
	$loc('.locator_bottle').html('<option value="0">Select a Bottle Size</option>');
	for (var a in wine_array){
		if (a != 'RemoveAt'){ //fix for added array key
			wine_id = wine_array[a];
			//populate the regions
			for (var b in loc_wine_bottles[wine_id]){
				if (b != 'RemoveAt'){ //fix for added array key
					if (! $loc('.locator_bottle option[value="'+loc_wine_bottles[wine_id][b]+'"]').is('*')){
						select = false;
						if (selected_bottle == loc_wine_bottles[wine_id][b]){
							select = true;
						}
						$loc('.locator_bottle').append(get_option_html(loc_bottle_rename, loc_wine_bottles[wine_id][b], loc_wine_bottles[wine_id][b], select));
					}
				}
			}
		}
	}
	sort_dropdown('.locator_bottle');
	
	//remove the bottles based on the region chosen
	region_id = $loc('.locator_region').val();
	if (region_id != undefined){
		region_array = new Array();
		if (region_id != 0){
			region_array.push(region_id);
		} else {
			$loc('.locator_region option').each(function(){
				region_id = $loc(this).val();
				region_array.push(region_id);
			});
		}
		
		bottle_array = new Array();
		for (var a in region_array){
			region_id = region_array[a];
			for (var b in loc_region_bottles[region_id]){
				if ($loc.inArray(loc_region_bottles[region_id][b], bottle_array) === -1){
					bottle_array.push(loc_region_bottles[region_id][b]);
				}
			}
		}
		
		//remove the bottles that are not in the bottle array
		$loc('.locator_bottle option').each(function(){
			bottle_id = $loc(this).val();
			if (bottle_id != '0'){
				if ($loc.inArray(bottle_id, bottle_array) === -1){
					$loc(this).remove();
				}
			}
		});
	}
}

//check to make sure all form elements are filled in approriately. fills the form_errors array if not, and the form_values object if the value is accepted.
var form_errors = new Array();
var form_values = new Object();
function loc_check_form(){
	form_values = new Array();
	
	//check the legal age field
	if (loc_legal_age === true){
		if ($loc('.locator_legalage').is(':checked') === false){
			form_errors[form_errors.length] = 'locator_legalage';
			
			if (loc_age_fail === false){
				loc_age_fail = true;
			} else {
				//send the user to the century council site
				var url = 'http://www.centurycouncil.org/';
				var windowName = 'CenturyCouncil';

				window.location = url;
			}
		}
	}
	
	if (loc_brand === false){
		if ($loc('.locator_brand').val() == '0'){
			form_errors[form_errors.length] = 'locator_brand';
		} else {
			form_values.brand = $loc('.locator_brand').val();
		}
	} else {
		form_values.brand = loc_brand;
	}
	
	if (loc_subbrand_dropdown === true){
		if ($loc('.locator_subbrand').val() == '0'){
			if (loc_subbrand_required === true){ //if the subbrand is required
				form_errors[form_errors.length] = 'locator_subbrand';
			}
		} else {
			form_values.subbrand = $loc('.locator_subbrand').val();
		}
	}
	
	if (loc_region_dropdown === true){
		if ($loc('.locator_region').val() == '0'){
		} else {
			form_values.region = $loc('.locator_region').val();
		}
	}
	
	if ($loc('.locator_varietal').val() == '0'){
		if (loc_varietal_required === true){ //if the varietal is required
			form_errors[form_errors.length] = 'locator_varietal';
		}
	} else {
		form_values.varietal = $loc('.locator_varietal').val();
	}
	

	if (loc_bottle_dropdown === true){
		if ($loc('.locator_bottle').val() == '0'){
		} else {
			form_values.bottle = $loc('.locator_bottle').val();
		}
	}
	
	if (($loc('.locator_address').val() == '') && ($loc('.locator_current').is(':checked') === false)){
		form_errors[form_errors.length] = 'locator_address';
	} else if ($loc('.locator_address').val() == ''){
		form_values.address = 'Current Location';
	} else {
		form_values.address = $loc('.locator_address').val();
	}
	
	if ((isNaN($loc('.locator_miles').val()) === true) || ($loc('.locator_miles').val() == '')){
		form_errors[form_errors.length] = 'locator_miles';
	} else {
		form_values.miles = $loc('.locator_miles').val();
	}
	
	type_selected = $loc('input[name="locator_type"]:checked');
	if (type_selected.length <= 0){
		form_errors[form_errors.length] = 'locator_type';
	} else {
		form_values.type = type_selected.val();
	}
	
	if (form_errors.length > 0){
		return false;
	} else {
		return true;
	}
}

//use the browser geolocation feature to determine latitude and longitude
var geo_lat = false;
var geo_lng = false;
function loc_initiate_geolocation(){
	navigator.geolocation.getCurrentPosition(loc_set_coords, loc_fail_coords);  
}  
function loc_set_coords(position){
	form_values.lat = position.coords.latitude;
	form_values.lng = position.coords.longitude;
	
	geo_lat = position.coords.latitude;
	geo_lng = position.coords.longitude;
	
	loc_submit_search(); 
}
function loc_fail_coords(error){
	form_errors[form_errors.length] = 'geo_error'+error.code;
	loc_set_errors();
	set_loading(false);
}

//get the latitude and longitude from google with the provided address
function loc_google_geocode(){
	var address = $loc('.locator_address').val();
	loc_address_input = address;
	var geocoder = new google.maps.Geocoder();
	geocoder.geocode( { 'address': address}, function(results, status) {
		if (status == google.maps.GeocoderStatus.OK) {
			form_values.lat = results[0].geometry.location.lat();
			form_values.lng = results[0].geometry.location.lng();
			
			geo_lat = form_values.lat;
			geo_lng = form_values.lng;
			
			loc_submit_search(); 
		} else {
			form_errors[form_errors.length] = 'google_geo_error';
			loc_set_errors();
		}
	});
}

//call the api to get the search results
function loc_submit_search(){
	
	if (loc_address_input == false){
		track_analytics_event('Search', 'Current-Location');
	} else {
		track_analytics_event('Search', loc_address_input);
	}
	
	//build the parameters for the api search call
	if (loc_show_restricted === true){
		url_parameters = '&stateRestriction=N';
	} else {
		url_parameters = '&stateRestriction=Y';
	}
	url_parameters += '&latitude='+ form_values.lat;
	url_parameters += '&longitude='+ form_values.lng;
	url_parameters += '&brandCode='+ form_values.brand;
	
	if (typeof(form_values.varietal) != 'undefined'){
		url_parameters += '&varietalCode='+ form_values.varietal;
	}
	
	if (typeof(form_values.bottle) != 'undefined'){
		url_parameters += '&itemSizeDesc='+ form_values.bottle;
	}
	
	url_parameters += '&radiusInMiles='+ form_values.miles;
	
	if (form_values.type == 'store'){
		url_parameters += '&premiseTypeDesc=OFF%20PREMISE';
	} else {
		url_parameters += '&premiseTypeDesc=ON%20PREMISE';
	}
	
	if (typeof(form_values.subbrand) != 'undefined'){
		url_parameters += '&subBrandCode='+ form_values.subbrand;
	}
	
	if (typeof(form_values.region) != 'undefined'){
		url_parameters += '&appelationDesc='+ form_values.region;
	}
	
	//limit the records retrieved
	url_parameters += '&from=0&to='+loc_max_results;
	
	url = loc_api_url+'productlocations?apiKey='+loc_api_key+url_parameters;
	
	//start time for analytics
	var startTime = new Date().getTime();
	
	$loc.ajax({
		url: url,
		dataType: 'xml',
		cache: 'false',
		error: function(){
			loc_clear_errors();
			form_errors[form_errors.length] = 'no_api';
			loc_set_errors();
		}
	}).done(function(data){
		//end time for analytics
		var timeSpent = new Date().getTime() - startTime;
				
		//track timing to GA
		track_analytics_timing(sourceTag, 'search', timeSpent);
		
		//clear the search results array and rebuild it with the new search data
		loc_search_results = new Array();

		full_address = '';
		full_address_new = '';

		$loc(data).find('plSearchDetails').each(function(i, e){
			result_key = loc_search_results.length;

			//MKD 20131011 - Changed to check if address was already displayed
			full_address_new = $loc(e).find('addr01Dsc').text()+', '+$loc(e).find('cityDsc').text()+' '+$loc(e).find('stateCd').text()

			if (full_address_new != full_address) {
	
				full_address = full_address_new;

				loc_search_results[result_key] = new Object();
			
				loc_search_results[result_key].address = $loc(e).find('addr01Dsc').text();
				loc_search_results[result_key].city = $loc(e).find('cityDsc').text();
				loc_search_results[result_key].state = $loc(e).find('stateCd').text();
				loc_search_results[result_key].zipcode = $loc(e).find('postalCd').text();
				loc_search_results[result_key].name = $loc(e).find('storeName').text();
				if ($loc(e).find('areaCd').text() != '000'){
					phone = '('+$loc(e).find('areaCd').text()+') '+$loc(e).find('phoneNo').text();
					loc_search_results[result_key].phone = [phone.slice(0, 9), '-', phone.slice(9)].join('');
				} else {
					loc_search_results[result_key].phone = '';
				}
				loc_search_results[result_key].lat = $loc(e).find('latitude').text();
				loc_search_results[result_key].lng = $loc(e).find('longitude').text();
			}
		});
		
		if (loc_search_results.length == 0){ //if there are no results, show the error
			form_errors[form_errors.length] = 'no_results';
			loc_set_errors();
			clear_map_markers();
			loc_screen_action('no_results');
		} else {
			loc_screen_action('search');
			loc_map_resize();
			loc_update_result_breadcrumbs();
			loc_sort_results();
			loc_populate_results(0);
			loc_update_pagination();
			loc_update_map_markers();
		}
		
		set_loading(false);
	});
}

//set the results breadcrumbs section with the search data
function loc_update_result_breadcrumbs(){

	var breadcrumbs = '';
	if (loc_brand !== false){
		brand_id = loc_brand;
	} else {
		brand_id = parseInt($loc('.locator_brand').val());
		breadcrumbs += loc_brands[brand_id]+' &#187; ';
	}
	
	
	if (typeof(form_values.subbrand) != 'undefined'){
		breadcrumbs += loc_subbrands[form_values.subbrand]+' &#187; ';
	}
	
	if (typeof(form_values.varietal) != 'undefined'){
		breadcrumbs += loc_wines[form_values.varietal]+' &#187; ';
	}
	
	if (typeof(form_values.region) != 'undefined'){
		breadcrumbs += loc_regions[form_values.region]+' &#187; ';
	}
	
	if (typeof(form_values.bottle) != 'undefined'){
		breadcrumbs += loc_bottles[form_values.bottle]+' &#187; ';
	}
	
	breadcrumbs += form_values.address+' &#187; ';
	breadcrumbs += form_values.miles+' miles &#187; ';
	
	if (form_values.type == 'store'){
		breadcrumbs += 'In Store';
	} else {
		breadcrumbs += 'Restaurant';
	} 
	
	$loc('.locator_breadcrumbs').html(breadcrumbs);
}

//following functions convert two sets and coordinates into distance in miles.
function loc_get_distance(lat1,lon1,lat2,lon2) {
	var R = 6371; // Radius of the earth in km
	var dLat = loc_deg2rad(lat2-lat1);  // deg2rad below
	var dLon = loc_deg2rad(lon2-lon1); 
	var a = 
		Math.sin(dLat/2) * Math.sin(dLat/2) +
		Math.cos(loc_deg2rad(lat1)) * Math.cos(loc_deg2rad(lat2)) * 
		Math.sin(dLon/2) * Math.sin(dLon/2)
		; 
	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
	var d = R * c; // Distance in km
	var d = d / 1.60934; // Convert to miles
	return d;
}
function loc_deg2rad(deg) {
	return deg * (Math.PI/180);
}
function loc_sort_distance(a,b) {
  if (a.distance < b.distance)
     return -1;
  if (a.distance > b.distance)
    return 1;
  return 0;
}

//sort the returned results by the lat and lng
function loc_sort_results(){
	
	for (var a in loc_search_results){
		loc_search_results[a].distance = loc_get_distance(form_values.lat, form_values.lng, loc_search_results[a].lat, loc_search_results[a].lng);
	}
	
	loc_search_results.sort(loc_sort_distance);
}

//update the pagination section with the approriate numbering
function loc_update_pagination(){
	$loc('.locator_pages').html('');
	$loc('.locator_pages').append('<a class="locator_previous" rel="previous">&#171; Previous '+loc_result_display_limit+'</a> ');
	
	pages = Math.ceil(loc_search_results.length / loc_result_display_limit);
	for (a=1; a<=pages; a++){
		page_class = '';
		if ((loc_current_page + 1) == a){ page_class = 'class="locator_current_page"'; }
		$loc('.locator_pages').append(' <a rel="'+a+'" '+page_class+'>'+a+'</a> ');
	}
	
	$loc('.locator_pages').append(' <a class="locator_next" rel="next">Next '+loc_result_display_limit+' &#187;</a>');
}

//clear map markers
function clear_map_markers(){
	for (a=0;a< markers_array.length;a++ ) {
    markers_array[a].setMap(null);
  }
}

//update the map markers
var markers_array = new Array();
function loc_update_map_markers(){
	
	//clear the existing markers
	clear_map_markers();

	start = loc_result_display_limit * loc_current_page;
	max = loc_result_display_limit * (loc_current_page + 1);
	if (max > loc_search_results.length){
		max = loc_search_results.length;
	}
	
	var infowindow = new google.maps.InfoWindow();
	var marker, a;
	
	markers_array = new Array();
	for (a=start;a<max;a++){
		
		marker = new google.maps.Marker({
			position: new google.maps.LatLng(loc_search_results[a].lat, loc_search_results[a].lng),
			map: map,
			icon: loc_system_url+'map_pin.png',
			animation: google.maps.Animation.DROP
		});
		
		full_address = loc_search_results[a].address+', '+loc_search_results[a].city+' '+loc_search_results[a].state+', '+loc_search_results[a].zipcode
		encode_address = encodeURIComponent(full_address);
		google_address = 'http://maps.google.com/maps?saddr='+geo_lat+','+geo_lng+'&daddr='+encode_address;
		content = '<div class="locator_info_window">';
		content += '<input type="button" value="Directions" class="locator_directions" rel="'+google_address+'***'+full_address+'***'+loc_search_results[a].name+'" />';	
		if (loc_invite == true){
			content += '<br/><input type="button" value="Invite Friends" class="locator_invite_trigger" rel="'+a+'***'+full_address+'***'+loc_search_results[a].name+'" />';
		}
		content += loc_search_results[a].name+'<br/>';
		content += loc_search_results[a].address+', '+loc_search_results[a].city+' '+loc_search_results[a].state+', '+loc_search_results[a].zipcode+'<br/>';
		content += loc_search_results[a].phone;
		content += '</div>';
	
		loc_search_results[a].content = content;
	
		google.maps.event.addListener(marker, 'click', (function(marker, a) {
			return function() {
				infowindow.setContent(loc_search_results[a].content);
				infowindow.open(map, marker);
			}
		})(marker, a));
	
		markers_array.push(marker);

	}
	
	loc_auto_center();
}

//auto center and zoom the map based on the existing markers
function loc_auto_center() {
	var bounds = new google.maps.LatLngBounds();
	$loc.each(markers_array, function (index, marker) {
		bounds.extend(marker.position);
	});
	map.fitBounds(bounds);
}

//populate the results html with the result data, according to the page of results
function loc_populate_results(page){
	full_address = '';
	loc_current_page = page;
	
	start = loc_result_display_limit * page;
	max = loc_result_display_limit * (page + 1);
	if (max > loc_search_results.length){
		max = loc_search_results.length;
	}
	$loc('.locator_locations').html('');
	for (a=start;a<max;a++){

		full_address = loc_search_results[a].address+', '+loc_search_results[a].city+' '+loc_search_results[a].state+', '+loc_search_results[a].zipcode

		encode_address = encodeURIComponent(full_address);
		google_address = 'http://maps.google.com/maps?saddr='+geo_lat+','+geo_lng+'&daddr='+encode_address;
		
		result_html = '<li>';
		result_html += '	<div class="directions">'+Number((loc_search_results[a].distance).toFixed(1))+' Miles<br/>';
		result_html += '	<input type="button" value="Directions" class="locator_directions" rel="'+google_address+'***'+full_address+'***'+loc_search_results[a].name+'" />';
		if (loc_invite == true){
			result_html += '	<br/><input type="button" value="Invite Friends" class="locator_invite_trigger" rel="'+a+'***'+full_address+'***'+loc_search_results[a].name+'" />';
		}
		result_html += '	</div>';
		result_html += '	'+loc_search_results[a].name;
		result_html += '<br/>';
		result_html += '	'+loc_search_results[a].address+', '+loc_search_results[a].city+' '+loc_search_results[a].state+', '+loc_search_results[a].zipcode+'<br/>';
		result_html += '	'+loc_search_results[a].phone;
		result_html += '	<div class="locator_clear"></div>';
		result_html += '	</li>';

		$loc('.locator_locations').append(result_html);
	}
}

//clear the errors
function loc_clear_errors(){
	form_errors = new Array();
	$loc('.locator_errors').css('display','none');
	$loc('.locator_errors').html('');
	$loc('.locator_input_error').each(function(){
		$loc(this).removeClass('locator_input_error');
	});
	$loc('.locator_input_error_label').each(function(){
		$loc(this).removeClass('locator_input_error_label');
	});
}

//display the errors
function loc_set_errors(){
	for (var a in form_errors){
		$loc('.'+form_errors[a]).addClass('locator_input_error');
		$loc('.'+form_errors[a]+'_label').addClass('locator_input_error_label');
		$loc('.locator_errors').append('<li>'+loc_error_text[form_errors[a]]+'</li>');
	}
	$loc('.locator_errors').css('display','block');
}

//handle the responsive size changes by adding and removing css classes
function loc_update_size(width){
	old_class = $loc('.locator').attr('class');
	
	if (width > loc_medium_break){
		new_class = 'locator_large';
		allow_zoom(true);
	} else if (width > loc_small_break){
		new_class = 'locator_medium';
		allow_zoom(true);
	} else {
		new_class = 'locator_small';
		allow_zoom(false);
	}
	
	if (old_class.indexOf(new_class) === -1)
	{
		$loc('.locator').removeClass('locator_small locator_medium locator_large');
		$loc('.locator').addClass(new_class);
		
		loc_current_size = new_class.replace('locator_','');
		
		loc_update_screens();
	}
	
	loc_map_resize();
}

//display the proper html sections based on the current display property for each size
function loc_update_screens(){
	if (loc_current_size == 'large'){
		if (loc_display['large'] == 'results'){
			$loc('.locator_large .locator_invite').css('display','none');
			$loc('.locator_large .locator_form').css('display','block');
			$loc('.locator_large .locator_map_heading').css('display','none');
			$loc('.locator_large .locator_map').css('display','block');
			$loc('.locator_large .locator_results').css('display','block');
			$loc('.locator_large .locator_navigation').css('display','none');
			$loc('.locator_large .locator_invite_header').css('display','none');
			loc_map_resize();
		} else if (loc_display['large'] == 'form'){
			$loc('.locator_large .locator_invite').css('display','none');
			$loc('.locator_large .locator_form').css('display','block');
			$loc('.locator_large .locator_map_heading').css('display','none');
			$loc('.locator_large .locator_map').css('display','block');
			$loc('.locator_large .locator_results').css('display','none');
			$loc('.locator_large .locator_navigation').css('display','none');
			$loc('.locator_large .locator_invite_header').css('display','none');
			loc_map_resize();
		} else if (loc_display['large'] == 'invite'){
			$loc('.locator_large .locator_form').css('display','none');
			$loc('.locator_large .locator_map_heading').css('display','none');
			$loc('.locator_large .locator_map').css('display','none');
			$loc('.locator_large .locator_results').css('display','none');
			$loc('.locator_large .locator_navigation').css('display','none');
			$loc('.locator_large .locator_invite').css('display','block');
			$loc('.locator_large .locator_invite .locator_invite_links').css('display','block');
			$loc('.locator_large .locator_invite .locator_invite_form').css('display','inline-block');
			$loc('.locator_large .locator_invite .locator_invite_message').css('display','inline-block');
			$loc('.locator_large .locator_invite .locator_invite_full_button').css('display','block');
			$loc('.locator_large .locator_invite .locator_invite_small_button').css('display','none');
			$loc('.locator_large .locator_invite_header').css('display','none');
			loc_map_resize();
		}
	} else if (loc_current_size == 'medium'){
		if (loc_display['medium'] == 'results'){
			$loc('.locator_medium .locator_invite').css('display','none');
			$loc('.locator_medium .locator_form').css('display','block');
			$loc('.locator_medium .locator_map_heading').css('display','none');
			$loc('.locator_medium .locator_map').css('display','block');
			$loc('.locator_medium .locator_results').css('display','block');
			$loc('.locator_medium .locator_navigation').css('display','none');
			$loc('.locator_medium .locator_invite_header').css('display','none');
			loc_map_resize();
		} else if (loc_display['medium'] == 'form'){
			$loc('.locator_medium .locator_invite').css('display','none');
			$loc('.locator_medium .locator_form').css('display','block');
			$loc('.locator_medium .locator_map_heading').css('display','none');
			$loc('.locator_medium .locator_map').css('display','block');
			$loc('.locator_medium .locator_results').css('display','none');
			$loc('.locator_medium .locator_navigation').css('display','none');
			$loc('.locator_medium .locator_invite_header').css('display','none');
			loc_map_resize();
		} else if (loc_display['medium'] == 'invite'){
			$loc('.locator_medium .locator_form').css('display','none');
			$loc('.locator_medium .locator_map_heading').css('display','none');
			$loc('.locator_medium .locator_map').css('display','none');
			$loc('.locator_medium .locator_results').css('display','none');
			$loc('.locator_medium .locator_navigation').css('display','none');
			$loc('.locator_medium .locator_invite').css('display','block');
			$loc('.locator_medium .locator_invite .locator_invite_links').css('display','block');
			$loc('.locator_medium .locator_invite .locator_invite_form').css('display','inline-block');
			$loc('.locator_medium .locator_invite .locator_invite_message').css('display','inline-block');
			$loc('.locator_medium .locator_invite .locator_invite_full_button').css('display','block');
			$loc('.locator_medium .locator_invite .locator_invite_small_button').css('display','none');
			$loc('.locator_medium .locator_invite_header').css('display','none');
			loc_map_resize();
		}
	} else if (loc_current_size == 'small'){
		if (loc_display['small'] == 'form'){
			if (loc_small_map === false){
				$loc('.locator_small .locator_map').css('display','none');
			} else {
				$loc('.locator_small .locator_map').css('display','block');
			}
		} else if (loc_display['small'] == 'results'){
			$loc('.locator_small .locator_invite').css('display','none');
			$loc('.locator_small .locator_form').css('display','none');
			$loc('.locator_small .locator_map_heading').css('display','block');
			$loc('.locator_small .locator_map').css('display','block');
			$loc('.locator_small .locator_results').css('display','block');
			$loc('.locator_small .locator_navigation').css('display','block');
			$loc('.locator_small .locator_navigation .locator_navigation_results').css('display','block');
			$loc('.locator_small .locator_navigation .locator_navigation_research').css('display','none');
			$loc('.locator_small .locator_navigation .locator_narrow_search').css('display','none');
			$loc('.locator_small .locator_navigation .locator_narrow_results').css('display','none');
			$loc('.locator_small .locator_navigation .locator_narrow_map').css('display','none');
			$loc('.locator_small .locator_navigation .locator_navigation_invite').css('display','none');
			$loc('.locator_small .locator_navigation .locator_navigation_invite_form').css('display','none');
			$loc('.locator_small .locator_navigation .locator_navigation_invite_message').css('display','none');
			$loc('.locator_small .locator_invite_header').css('display','none');
			loc_map_resize();
		} else if (loc_display['small'] == 'research'){
			$loc('.locator_small .locator_invite').css('display','none');
			$loc('.locator_small .locator_form').css('display','block');
			$loc('.locator_small .locator_map_heading').css('display','none');

			if (loc_small_map === false){
				$loc('.locator_small .locator_map').css('display','none');
			} else {
				$loc('.locator_small .locator_map').css('display','block');
			}
			$loc('.locator_small .locator_results').css('display','none');
			$loc('.locator_small .locator_navigation').css('display','block');
			$loc('.locator_small .locator_navigation .locator_navigation_results').css('display','none');
			$loc('.locator_small .locator_navigation .locator_navigation_research').css('display','block');
			$loc('.locator_small .locator_navigation .locator_narrow_search').css('display','none');
			$loc('.locator_small .locator_navigation .locator_narrow_results').css('display','none');
			$loc('.locator_small .locator_navigation .locator_narrow_map').css('display','none');
			$loc('.locator_small .locator_navigation .locator_navigation_invite').css('display','none');
			$loc('.locator_small .locator_navigation .locator_navigation_invite_form').css('display','none');
			$loc('.locator_small .locator_navigation .locator_navigation_invite_message').css('display','none');
			$loc('.locator_small .locator_invite_header').css('display','none');
		} else if (loc_display['small'] == 'invite'){
			$loc('.locator_small .locator_form').css('display','none');
			$loc('.locator_small .locator_map_heading').css('display','none');
			$loc('.locator_small .locator_map').css('display','none');
			$loc('.locator_small .locator_results').css('display','none');
			$loc('.locator_small .locator_navigation').css('display','block');
			$loc('.locator_small .locator_navigation .locator_navigation_results').css('display','none');
			$loc('.locator_small .locator_navigation .locator_navigation_research').css('display','none');
			$loc('.locator_small .locator_navigation .locator_narrow_search').css('display','none');
			$loc('.locator_small .locator_navigation .locator_narrow_results').css('display','none');
			$loc('.locator_small .locator_navigation .locator_narrow_map').css('display','none');
			$loc('.locator_small .locator_navigation .locator_navigation_invite').css('display','block');
			$loc('.locator_small .locator_navigation .locator_navigation_invite_form').css('display','none');
			$loc('.locator_small .locator_navigation .locator_navigation_invite_message').css('display','none');
			$loc('.locator_small .locator_invite').css('display','block');
			$loc('.locator_small .locator_invite .locator_invite_links').css('display','block');
			$loc('.locator_small .locator_invite .locator_invite_form').css('display','none');
			$loc('.locator_small .locator_invite .locator_invite_message').css('display','none');
			$loc('.locator_small .locator_invite .locator_invite_full_button').css('display','none');
			$loc('.locator_small .locator_invite .locator_invite_small_button').css('display','block');
			$loc('.locator_small .locator_invite_header').css('display','none');
			loc_map_resize();
		} else if (loc_display['small'] == 'invite_form'){
			$loc('.locator_small .locator_form').css('display','none');
			$loc('.locator_small .locator_map_heading').css('display','none');
			$loc('.locator_small .locator_map').css('display','none');
			$loc('.locator_small .locator_results').css('display','none');
			$loc('.locator_small .locator_navigation').css('display','block');
			$loc('.locator_small .locator_navigation .locator_navigation_results').css('display','none');
			$loc('.locator_small .locator_navigation .locator_navigation_research').css('display','none');
			$loc('.locator_small .locator_navigation .locator_narrow_search').css('display','none');
			$loc('.locator_small .locator_navigation .locator_narrow_results').css('display','none');
			$loc('.locator_small .locator_navigation .locator_narrow_map').css('display','none');
			$loc('.locator_small .locator_navigation .locator_navigation_invite').css('display','none');
			$loc('.locator_small .locator_navigation .locator_navigation_invite_form').css('display','block');
			$loc('.locator_small .locator_navigation .locator_navigation_invite_message').css('display','none');
			$loc('.locator_small .locator_invite').css('display','block');
			$loc('.locator_small .locator_invite .locator_invite_links').css('display','none');
			$loc('.locator_small .locator_invite .locator_invite_form').css('display','block');
			$loc('.locator_small .locator_invite .locator_invite_message').css('display','none');
			$loc('.locator_small .locator_invite .locator_invite_full_button').css('display','none');
			$loc('.locator_small .locator_invite .locator_invite_small_button').css('display','block');
			$loc('.locator_small .locator_invite_header').css('display','none');
			loc_map_resize();
		} else if (loc_display['small'] == 'invite_message'){
			$loc('.locator_small .locator_form').css('display','none');
			$loc('.locator_small .locator_map_heading').css('display','none');
			$loc('.locator_small .locator_map').css('display','none');
			$loc('.locator_small .locator_results').css('display','none');
			$loc('.locator_small .locator_navigation').css('display','block');
			$loc('.locator_small .locator_navigation .locator_navigation_results').css('display','none');
			$loc('.locator_small .locator_navigation .locator_navigation_research').css('display','none');
			$loc('.locator_small .locator_navigation .locator_narrow_search').css('display','none');
			$loc('.locator_small .locator_navigation .locator_narrow_results').css('display','none');
			$loc('.locator_small .locator_navigation .locator_narrow_map').css('display','none');
			$loc('.locator_small .locator_navigation .locator_navigation_invite').css('display','none');
			$loc('.locator_small .locator_navigation .locator_navigation_invite_form').css('display','none');
			$loc('.locator_small .locator_navigation .locator_navigation_invite_message').css('display','block');
			$loc('.locator_small .locator_invite').css('display','block');
			$loc('.locator_small .locator_invite .locator_invite_links').css('display','none');
			$loc('.locator_small .locator_invite .locator_invite_form').css('display','none');
			$loc('.locator_small .locator_invite .locator_invite_message').css('display','block');
			$loc('.locator_small .locator_invite .locator_invite_full_button').css('display','none');
			$loc('.locator_small .locator_invite .locator_invite_small_button').css('display','block');
			$loc('.locator_small .locator_invite_header').css('display','none');
			loc_map_resize();
		}
	} else if (loc_current_size == 'widget'){
		if (loc_display['widget'] == 'results'){
			$loc('.locator_widget .locator_invite').css('display','none');
			$loc('.locator_widget .locator_form').css('display','none');
			$loc('.locator_widget .locator_map_heading').css('display','none');
			$loc('.locator_widget .locator_invite_header').css('display','none');
			$loc('.locator_widget .locator_search_header').css('display','none');
			$loc('.locator_widget .locator_results_header').css('display','block');
			$loc('.locator_widget .locator_map').css('display','block');
			$loc('.locator_widget .locator_results').css('display','block');
			$loc('.locator_widget .locator_navigation').css('display','none');
			loc_map_resize();
		} else if (loc_display['widget'] == 'research'){
			$loc('.locator_widget .locator_invite').css('display','none');
			$loc('.locator_widget .locator_form').css('display','block');
			$loc('.locator_widget .locator_invite_header').css('display','none');
			$loc('.locator_widget .locator_map_heading').css('display','none');
			$loc('.locator_widget .locator_search_header').css('display','block');
			$loc('.locator_widget .locator_results_header').css('display','none');
			$loc('.locator_widget .locator_map').css('display','none');
			$loc('.locator_widget .locator_results').css('display','none');
			$loc('.locator_widget .locator_navigation').css('display','none');
		} else if (loc_display['widget'] == 'invite'){
			$loc('.locator_widget .locator_form').css('display','none');
			$loc('.locator_widget .locator_map_heading').css('display','none');
			$loc('.locator_widget .locator_search_header').css('display','none');
			$loc('.locator_widget .locator_results_header').css('display','none');
			$loc('.locator_widget .locator_map').css('display','none');
			$loc('.locator_widget .locator_results').css('display','none');
			$loc('.locator_widget .locator_navigation').css('display','none');
			$loc('.locator_widget .locator_invite').css('display','block');
			$loc('.locator_widget .locator_invite .locator_invite_links').css('display','block');
			$loc('.locator_widget .locator_invite .locator_invite_form').css('display','inline-block');
			$loc('.locator_widget .locator_invite .locator_invite_message').css('display','inline-block');
			$loc('.locator_widget .locator_invite .locator_invite_full_button').css('display','block');
			$loc('.locator_widget .locator_invite .locator_invite_small_button').css('display','none');
			$loc('.locator_widget .locator_invite_header').css('display','block');
			loc_map_resize();
		}
	} else if (loc_current_size == 'narrow'){
		if (loc_display['narrow'] == 'results'){
			$loc('.locator_narrow .locator_invite').css('display','none');
			$loc('.locator_narrow .locator_invite_header').css('display','none');
			$loc('.locator_narrow .locator_form').css('display','none');
			$loc('.locator_narrow .locator_map_heading').css('display','none');
			$loc('.locator_narrow .locator_search_header').css('display','none');
			$loc('.locator_narrow .locator_results_header').css('display','block');
			$loc('.locator_narrow .locator_map').css('display','none');
			$loc('.locator_narrow .locator_results').css('display','block');
			$loc('.locator_narrow .locator_navigation').css('display','block');
			$loc('.locator_narrow .locator_navigation .locator_navigation_results').css('display','none');
			$loc('.locator_narrow .locator_navigation .locator_navigation_research').css('display','none');
			$loc('.locator_narrow .locator_navigation .locator_narrow_search').css('display','none');
			$loc('.locator_narrow .locator_navigation .locator_narrow_results').css('display','block');
			$loc('.locator_narrow .locator_navigation .locator_narrow_map').css('display','none');
			$loc('.locator_narrow .locator_navigation .locator_navigation_invite').css('display','none');
			$loc('.locator_narrow .locator_navigation .locator_navigation_invite_form').css('display','none');
			$loc('.locator_narrow .locator_navigation .locator_navigation_invite_message').css('display','none');
		} else if (loc_display['narrow'] == 'research'){
			$loc('.locator_narrow .locator_invite').css('display','none');
			$loc('.locator_narrow .locator_invite_header').css('display','none');
			$loc('.locator_narrow .locator_form').css('display','block');
			$loc('.locator_narrow .locator_map_heading').css('display','none');
			$loc('.locator_narrow .locator_search_header').css('display','block');
			$loc('.locator_narrow .locator_results_header').css('display','none');
			$loc('.locator_narrow .locator_map').css('display','none');
			$loc('.locator_narrow .locator_results').css('display','none');
			$loc('.locator_narrow .locator_navigation').css('display','block');
			$loc('.locator_narrow .locator_navigation .locator_navigation_results').css('display','none');
			$loc('.locator_narrow .locator_navigation .locator_navigation_research').css('display','none');
			$loc('.locator_narrow .locator_navigation .locator_narrow_search').css('display','block');
			$loc('.locator_narrow .locator_navigation .locator_narrow_results').css('display','none');
			$loc('.locator_narrow .locator_navigation .locator_narrow_map').css('display','none');
			$loc('.locator_narrow .locator_navigation .locator_navigation_invite').css('display','none');
			$loc('.locator_narrow .locator_navigation .locator_navigation_invite_form').css('display','none');
			$loc('.locator_narrow .locator_navigation .locator_navigation_invite_message').css('display','none');
		} else if (loc_display['narrow'] == 'map'){
			$loc('.locator_narrow .locator_invite').css('display','none');
			$loc('.locator_narrow .locator_invite_header').css('display','none');
			$loc('.locator_narrow .locator_form').css('display','none');
			$loc('.locator_narrow .locator_map_heading').css('display','none');
			$loc('.locator_narrow .locator_search_header').css('display','none');
			$loc('.locator_narrow .locator_results_header').css('display','block');
			$loc('.locator_narrow .locator_map').css('display','block');
			$loc('.locator_narrow .locator_results').css('display','none');
			$loc('.locator_narrow .locator_navigation').css('display','block');
			$loc('.locator_narrow .locator_navigation .locator_navigation_results').css('display','none');
			$loc('.locator_narrow .locator_navigation .locator_navigation_research').css('display','none');
			$loc('.locator_narrow .locator_navigation .locator_narrow_search').css('display','none');
			$loc('.locator_narrow .locator_navigation .locator_narrow_results').css('display','none');
			$loc('.locator_narrow .locator_navigation .locator_narrow_map').css('display','block');
			$loc('.locator_narrow .locator_navigation .locator_navigation_invite').css('display','none');
			$loc('.locator_narrow .locator_navigation .locator_navigation_invite_form').css('display','none');
			$loc('.locator_narrow .locator_navigation .locator_navigation_invite_message').css('display','none');
			loc_map_resize();
			loc_auto_center();
		} else if (loc_display['narrow'] == 'invite'){
			$loc('.locator_narrow .locator_invite').css('display','block');
			$loc('.locator_narrow .locator_invite_links').css('display','block');
			$loc('.locator_narrow .locator_invite_form').css('display','none');
			$loc('.locator_narrow .locator_invite_message').css('display','none');
			$loc('.locator_narrow .locator_invite_header').css('display','block');
			$loc('.locator_narrow .locator_form').css('display','none');
			$loc('.locator_narrow .locator_map_heading').css('display','none');
			$loc('.locator_narrow .locator_search_header').css('display','none');
			$loc('.locator_narrow .locator_results_header').css('display','none');
			$loc('.locator_narrow .locator_map').css('display','none');
			$loc('.locator_narrow .locator_results').css('display','none');
			$loc('.locator_narrow .locator_navigation').css('display','block');
			$loc('.locator_narrow .locator_navigation .locator_navigation_results').css('display','none');
			$loc('.locator_narrow .locator_navigation .locator_navigation_research').css('display','none');
			$loc('.locator_narrow .locator_navigation .locator_narrow_search').css('display','none');
			$loc('.locator_narrow .locator_navigation .locator_narrow_results').css('display','none');
			$loc('.locator_narrow .locator_navigation .locator_narrow_map').css('display','none');
			$loc('.locator_narrow .locator_navigation .locator_navigation_invite').css('display','block');
			$loc('.locator_narrow .locator_navigation .locator_navigation_invite_form').css('display','none');
			$loc('.locator_narrow .locator_navigation .locator_navigation_invite_message').css('display','none');
			$loc('.locator_narrow .locator_invite .locator_invite_full_button').css('display','none');
			$loc('.locator_narrow .locator_invite .locator_invite_small_button').css('display','block');
		} else if (loc_display['narrow'] == 'invite_form'){
			$loc('.locator_narrow .locator_invite').css('display','block');
			$loc('.locator_narrow .locator_invite_links').css('display','none');
			$loc('.locator_narrow .locator_invite_form').css('display','block');
			$loc('.locator_narrow .locator_invite_message').css('display','none');
			$loc('.locator_narrow .locator_invite_header').css('display','block');
			$loc('.locator_narrow .locator_form').css('display','none');
			$loc('.locator_narrow .locator_map_heading').css('display','none');
			$loc('.locator_narrow .locator_search_header').css('display','none');
			$loc('.locator_narrow .locator_results_header').css('display','none');
			$loc('.locator_narrow .locator_map').css('display','none');
			$loc('.locator_narrow .locator_results').css('display','none');
			$loc('.locator_narrow .locator_navigation').css('display','block');
			$loc('.locator_narrow .locator_navigation .locator_navigation_results').css('display','none');
			$loc('.locator_narrow .locator_navigation .locator_navigation_research').css('display','none');
			$loc('.locator_narrow .locator_navigation .locator_narrow_search').css('display','none');
			$loc('.locator_narrow .locator_navigation .locator_narrow_results').css('display','none');
			$loc('.locator_narrow .locator_navigation .locator_narrow_map').css('display','none');
			$loc('.locator_narrow .locator_navigation .locator_navigation_invite').css('display','none');
			$loc('.locator_narrow .locator_navigation .locator_navigation_invite_form').css('display','block');
			$loc('.locator_narrow .locator_navigation .locator_navigation_invite_message').css('display','none');
			$loc('.locator_narrow .locator_invite .locator_invite_full_button').css('display','none');
			$loc('.locator_narrow .locator_invite .locator_invite_small_button').css('display','block');
		} else if (loc_display['narrow'] == 'invite_message'){
			$loc('.locator_narrow .locator_invite').css('display','block');
			$loc('.locator_narrow .locator_invite_links').css('display','none');
			$loc('.locator_narrow .locator_invite_form').css('display','none');
			$loc('.locator_narrow .locator_invite_message').css('display','block');
			$loc('.locator_narrow .locator_invite_header').css('display','block');
			$loc('.locator_narrow .locator_form').css('display','none');
			$loc('.locator_narrow .locator_map_heading').css('display','none');
			$loc('.locator_narrow .locator_search_header').css('display','none');
			$loc('.locator_narrow .locator_results_header').css('display','none');
			$loc('.locator_narrow .locator_map').css('display','none');
			$loc('.locator_narrow .locator_results').css('display','none');
			$loc('.locator_narrow .locator_navigation').css('display','block');
			$loc('.locator_narrow .locator_navigation .locator_navigation_results').css('display','none');
			$loc('.locator_narrow .locator_navigation .locator_navigation_research').css('display','none');
			$loc('.locator_narrow .locator_navigation .locator_narrow_search').css('display','none');
			$loc('.locator_narrow .locator_navigation .locator_narrow_results').css('display','none');
			$loc('.locator_narrow .locator_navigation .locator_narrow_map').css('display','none');
			$loc('.locator_narrow .locator_navigation .locator_navigation_invite').css('display','none');
			$loc('.locator_narrow .locator_navigation .locator_navigation_invite_form').css('display','none');
			$loc('.locator_narrow .locator_navigation .locator_navigation_invite_message').css('display','block');
			$loc('.locator_narrow .locator_invite .locator_invite_full_button').css('display','none');
			$loc('.locator_narrow .locator_invite .locator_invite_small_button').css('display','block');
		}
	}
}

//set the proper display based on the user actions
function loc_screen_action(action){
	if (action == 'search'){
		loc_display['large'] = 'results';
		loc_display['medium'] = 'results';
		loc_display['small'] = 'results';
		loc_display['widget'] = 'results';
		loc_display['narrow'] = 'results';
	} else if (action == 'research'){
		loc_display['small'] = 'research';
		loc_display['widget'] = 'research';
		loc_display['narrow'] = 'research';
	}	else if (action == 'map'){
		loc_display['narrow'] = 'map';
	}	else if (action == 'no_results'){
		loc_display['large'] = 'form';
		loc_display['medium'] = 'form';
		loc_display['small'] = 'research';
		loc_display['widget'] = 'research';
		loc_display['narrow'] = 'research';
	}	else if (action == 'invite'){
		loc_display['large'] = 'invite';
		loc_display['medium'] = 'invite';
		loc_display['small'] = 'invite';
		loc_display['widget'] = 'invite';
		loc_display['narrow'] = 'invite';
	}	else if (action == 'invite_form'){
		loc_display['large'] = 'invite';
		loc_display['medium'] = 'invite';
		loc_display['small'] = 'invite_form';
		loc_display['widget'] = 'invite';
		loc_display['narrow'] = 'invite_form';
	}	else if (action == 'invite_message'){
		loc_display['large'] = 'invite';
		loc_display['medium'] = 'invite';
		loc_display['small'] = 'invite_message';
		loc_display['widget'] = 'invite';
		loc_display['narrow'] = 'invite_message';
	}
	
	loc_update_screens(loc_current_size);
}

//handle the resizing and recentering on window width change
function loc_map_resize(){
	if (typeof map !== "undefined"){
		var currCenter = map.getCenter();
		google.maps.event.trigger(map, 'resize');
		map.setCenter(currCenter);
	}
}

//initialize the google map
var map;
function loc_map_initialize(){
	var mapOptions = {
		center: new google.maps.LatLng(37.160317,-99.140625),
		zoom: 4,
		mapTypeId: google.maps.MapTypeId.ROADMAP
	};
	map = new google.maps.Map($loc('.locator_inner_map')[0], mapOptions);
}

/* Begin analytics code */

//this function handles the analytics tracking event
function track_analytics_event(category, action){
	label = document.URL;
	if (typeof _gaq != 'undefined'){
		_gaq.push(['_trackEvent', loc_brand_name+' - '+category, action, label]);
	}

	if (typeof ga != 'undefined'){
		ga('send', 'event', loc_brand_name+' - '+category, action, label);
	}
}

//this function handles the analytics timing event
function track_analytics_timing(dataSource, query, elapsedTime){
	label = document.URL;
	if (typeof _gaq != 'undefined'){
		_gaq.push(['_trackTiming', 'API call', query, elapsedTime, dataSource, 100]);
	}
}

function allow_zoom(flag) {
  if (flag == true) {
    $loc('head meta[name=viewport]').remove();
    $loc('head').prepend('<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=10.0, minimum-scale=1, user-scalable=1" />');
  } else {
    $loc('head meta[name=viewport]').remove();
    $loc('head').prepend('<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=0" />');              
  }
}

//build the facebook link
function facebook_build_share(){
	invite_location = loc_search_results[loc_invite_key];
	description = invite_location.name+'<center></center>';
	description += invite_location.address+'<center></center>';
	description += invite_location.city+', '+invite_location.state+' '+invite_location.zipcode+'<center></center>';
	
	var href = 'https://www.facebook.com/dialog/feed?';
  href += 'app_id='+loc_invite_facebook_appid+'&';
  href += 'link='+document.URL+'&';
  href += 'name='+encodeURIComponent(loc_invite_facebook_header)+'&';
  href += 'caption='+encodeURIComponent(loc_invite_brand_message.replace('[location]', invite_location.name))+'&';
  href += 'description='+encodeURIComponent(description)+'&';
 	href += 'redirect_uri='+loc_system_url+'facebook_redirect.html';

	$loc('.locator_invite_facebook a').attr('href', href);
}

//build the twitter link
function twitter_build_share(){
	invite_location = loc_search_results[loc_invite_key];
	
	var href = 'https://twitter.com/intent/tweet?';
	href += 'text='+encodeURIComponent(loc_invite_brand_message.replace('[location]', invite_location.name))+'%0A%0A';
	href += invite_location.name+'%0A';
	href += invite_location.address+'%0A';
	href += invite_location.city+', '+invite_location.state+' '+invite_location.zipcode;

	$loc('.locator_invite_twitter a').attr('href', href);
}

//populate the invite section with data from the chosen invite key
function populate_invite(){
	invite_location = loc_search_results[loc_invite_key];
	
	//reset the form
	$loc('.locator_invite_recipients').html('');
	$loc('.locator_invite_sender_name').val('Name');
	$loc('.locator_invite_sender_email').val('Email Address');
	$loc('.locator_invite_recipient1_name').val('Name');
	$loc('.locator_invite_recipient1_email').val('Email Address');
	$loc('.locator_invite_custom_message').val(loc_invite_custom_message);
	
	//populate the message preview screen
	$loc('.locator_invite_preview_recipient').html($loc('.locator_invite_recipient1_name').val());
	$loc('.locator_invite_preview_message').html(loc_invite_brand_message.replace('[location]', invite_location.name));
	$loc('.locator_invite_preview_name').html(invite_location.name);
	$loc('.locator_invite_preview_address').html(invite_location.address);
	$loc('.locator_invite_preview_city').html(invite_location.city);
	$loc('.locator_invite_preview_state').html(invite_location.state);
	$loc('.locator_invite_preview_zip').html(invite_location.zipcode);
	$loc('.locator_invite_preview_custom').html(loc_invite_custom_message);
	$loc('.locator_invite_preview_sender').html($loc('.locator_invite_sender_name').val());
}

//update the message preview section
function update_invite_preview(){
	$loc('.locator_invite_preview_recipient').html($loc('.locator_invite_recipient1_name').val());
	$loc('.locator_invite_preview_custom').html($loc('.locator_invite_custom_message').val());
	$loc('.locator_invite_preview_sender').html($loc('.locator_invite_sender_name').val());
}

//add new fields to the recipient section
function loc_invite_add_recipient(){
	input_count = $loc('.locator_invite_recipients input').length;
	
	new_id = input_count/2 + 2;
	
	html = '<input type="text" class="locator_invite_recipient'+new_id+'_name locator_invite_name" value="Name">';
	html += '<input type="text" class="locator_invite_recipient'+new_id+'_email locator_invite_email" value="Email Address">';
	
	$loc('.locator_invite_recipients').append(html);
}

//validate the invite form
var invite_errors = new Array();
var invite_values = new Object();
function validate_invite(){
	
	set_loading(true);
	
	loc_invite_clear_errors();
	
	invite_errors = new Array();
	invite_values = new Object();
	
	//check the sender name
	if (($loc('.locator_invite_sender_name').val() == 'Name') || ($loc('.locator_invite_sender_name').val() == '')){
		invite_errors[invite_errors.length] = 'invite_sender_name';
	} else {
		invite_values.sender_name = $loc('.locator_invite_sender_name').val();
	}
	
	//check the sender email
	if (($loc('.locator_invite_sender_email').val() == 'Email Address') || ($loc('.locator_invite_sender_email').val() == '') || (!validate_email($loc('.locator_invite_sender_email').val()))){
		invite_errors[invite_errors.length] = 'invite_sender_email';
	} else {
		invite_values.sender_email = $loc('.locator_invite_sender_email').val();
	}
	
	//check the recipients
	recipients = new Object();
	recipient_num = 1;
	recipient_count = ($loc('.locator_invite_recipients input').length/2)+1;
	recip_error = false;
	for (a = 1; a <= recipient_count; a++){
		recip_name = $loc('.locator_invite_recipient'+a+'_name').val();
		recip_email = $loc('.locator_invite_recipient'+a+'_email').val();
		recip_name_pass = '';
		recip_email_pass = '';
		if ((recip_name == 'Name') || (recip_name == '')){
			recip_name_pass = 'blank';
		}
		if ((recip_email == 'Email Address') || (recip_email == '')){
			recip_email_pass = 'blank';
		}
		if ((recip_email_pass == 'blank') || (recip_name_pass == 'blank')){
			if ((recip_email_pass == 'blank') && (recip_name_pass == 'blank')){
			} else {
				invite_errors[invite_errors.length] = 'invite_recipients';
				recip_error = true;
				a = 99999999;
			}
		} else {
			if (validate_email(recip_email)){
				key = 'recipient'+recipient_num;
				recipient_num++;
				recipients[key] = new Object();
				recipients[key]['name'] = recip_name;
				recipients[key]['email'] = recip_email;
			} else {
				invite_errors[invite_errors.length] = 'invite_recipients';
				recip_error = true;
				a = 99999999;
			}
		}
	}
	if (recip_error === false){
		if (recipients.length == 0){
			invite_errors[invite_errors.length] = 'invite_recipients';
		} else {
			invite_values.recipients = recipients;
		}
	}
	
	if (invite_errors.length == 0){
		loc_send_invite_email();
	} else {
		loc_invite_set_errors();
	}
}

function validate_email(email){ 
	var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(email);
} 

//clear the errors
function loc_invite_clear_errors(){
	form_errors = new Array();
	$loc('.locator_invite_errors').css('display','none');
	$loc('.locator_invite_errors').html('');
}

//display the errors
function loc_invite_set_errors(){
	set_loading(false);
	for (var a in invite_errors){
		$loc('.locator_invite_errors').append('<li>'+loc_error_text[invite_errors[a]]+'</li>');
	}
	$loc('.locator_invite_errors').css('display','block');
}

//send the email to the mailer script
function loc_send_invite_email(){
	
	full_address = invite_location.address+', '+invite_location.city+' '+invite_location.state+', '+invite_location.zipcode;
	track_analytics_event('Invite-Email', invite_location.name+': '+full_address);
	invite_location = loc_search_results[loc_invite_key];
	
	var body = 'To [recipient],\r\n\r\n';
	body += loc_invite_brand_message.replace('[location]', invite_location.name)+'\r\n\r\n';
	body += invite_location.name+'\r\n';
	body += invite_location.address+'\r\n';
	body += invite_location.city+', '+invite_location.state+' '+invite_location.zipcode+'\r\n\r\n';
	body += $loc('.locator_invite_custom_message').val()+'\r\n\r\n';
	body += 'From,\r\n';
	body += invite_values.sender_name;
	
	post = new Object();
	post = {
		sender_email: invite_values.sender_email, 
		sender_name: invite_values.sender_name,
		recipients: invite_values.recipients,
		subject: loc_invite_email_subject,
		body: body
	}

	url = loc_mailer_url;

	$loc.ajax({
	  url: url,
		async: true,
		cache: 'false',
		type: 'POST',
		data: post,
		error: function(request, status, error){
			console.log(request);
			console.log('status: '+status);
			console.log('error: '+error);
		}
	}).done(function(data) {
		set_loading(false);
		alert('Your invitations have been sent!');
		loc_screen_action('search');
	});	
}
