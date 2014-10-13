function _tmpAutoFieldFiller(){
	$("select").each(function(i, el){
		$(el).find("option").first().prop("selected", true);
	});
	$("input[type='number']").val(20);
	$("input[type='radio']").prop("checked", true);
}

(function() {
	var ap = window.AppUX;
	var imgToLoad = {};
	var cssToLoad = ["side.libs/bootstrap.min.css", "module.demographics/main.css"];
	for(var i = 0, _keys = Object.keys(imgToLoad), ilen = _keys.length; i < ilen; i++) {
		ap.loadImage(_keys[i], ap.baseUrl + imgToLoad[_keys[i]], function() {
		});
	}
	for(var i = 0, ilen = cssToLoad.length; i < ilen; i++){
		ap.loadCss(ap.baseUrl + cssToLoad[i]);
	}
	var backgroundAreas = ["Accounting", "Advertising/PR", "Arts/Entertainment", "Business Services", "Buying/Retail", "Computer Science/IT", "Consulting", "Design/Architecture", "Education/Training", "Engineering", "Financial Services", "Government", "Health Care", "Hospitality/Event Planning", "Human Resources", "Investments/Banking", "Legal Services", "Management/Administration", "Marketing/Market Research", "Media/Publishing", "Non-Profits", "Sales/Real Estate", "Science/Research", "Social Services", "Sports/Recreation", "Other"];
	var ethnicBackgroundAreas = ["Afghanistan", "Åland Islands", "Albania", "Algeria", "American Samoa", "AndorrA", "Angola", "Anguilla", "Antarctica", "Antigua and Barbuda", "Argentina", "Armenia", "Aruba", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bermuda", "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Bouvet Island", "Brazil", "British Indian Ocean Territory", "Brunei Darussalam", "Bulgaria", "Burkina Faso", "Burundi", "Cambodia", "Cameroon", "Canada", "Cape Verde", "Cayman Islands", "Central African Republic", "Chad", "Chile", "China", "Christmas Island", "Cocos (Keeling) Islands", "Colombia", "Comoros", "Congo", "Congo, The Democratic Republic of the", "Cook Islands", "Costa Rica", "Cote D\"Ivoire", "Croatia", "Cuba", "Cyprus", "Czech Republic", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Ethiopia", "Falkland Islands (Malvinas)", "Faroe Islands", "Fiji", "Finland", "France", "French Guiana", "French Polynesia", "French Southern Territories", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Gibraltar", "Greece", "Greenland", "Grenada", "Guadeloupe", "Guam", "Guatemala", "Guernsey", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Heard Island and Mcdonald Islands", "Holy See (Vatican City State)", "Honduras", "Hong Kong", "Hungary", "Iceland", "India", "Indonesia", "Iran, Islamic Republic Of", "Iraq", "Ireland", "Isle of Man", "Israel", "Italy", "Jamaica", "Japan", "Jersey", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Korea, Democratic People\"S Republic of", "Korea, Republic of", "Kuwait", "Kyrgyzstan", "Lao People\"S Democratic Republic", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libyan Arab Jamahiriya", "Liechtenstein", "Lithuania", "Luxembourg", "Macao", "Macedonia, The Former Yugoslav Republic of", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Martinique", "Mauritania", "Mauritius", "Mayotte", "Mexico", "Micronesia, Federated States of", "Moldova, Republic of", "Monaco", "Mongolia", "Montserrat", "Morocco", "Mozambique", "Myanmar", "Namibia", "Nauru", "Nepal", "Netherlands", "Netherlands Antilles", "New Caledonia", "New Zealand", "Nicaragua", "Niger", "Nigeria", "Niue", "Norfolk Island", "Northern Mariana Islands", "Norway", "Oman", "Pakistan", "Palau", "Palestinian Territory, Occupied", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Pitcairn", "Poland", "Portugal", "Puerto Rico", "Qatar", "Reunion", "Romania", "Russian Federation", "RWANDA", "Saint Helena", "Saint Kitts and Nevis", "Saint Lucia", "Saint Pierre and Miquelon", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia and Montenegro", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Georgia and the South Sandwich Islands", "Spain", "Sri Lanka", "Sudan", "Suriname", "Svalbard and Jan Mayen", "Swaziland", "Sweden", "Switzerland", "Syrian Arab Republic", "Taiwan, Province of China", "Tajikistan", "Tanzania, United Republic of", "Thailand", "Timor-Leste", "Togo", "Tokelau", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Turks and Caicos Islands", "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "United States Minor Outlying Islands", "Uruguay", "Uzbekistan", "Vanuatu", "Venezuela", "Viet Nam", "Virgin Islands, British", "Virgin Islands, U.S.", "Wallis and Futuna", "Western Sahara", "Yemen", "Zambia", "Zimbabwe", "Other"];
	var webuse = ["fewer than 1", "1 to 3", "3 to 5", "more than 5"];
	
	var jqElBackgr = $("#educationalBackground");
	for(var i = 0, ilen = backgroundAreas.length; i < ilen; i++){
		var jqOpt = $("<option value=" + backgroundAreas[i] + ">" + backgroundAreas[i] + "</option>");
		jqElBackgr.append(jqOpt);
	}
	var jqElEthn = $("#ethnicBackground");
	for(var i = 0, ilen = ethnicBackgroundAreas.length; i < ilen; i++){
		var jqOpt = $("<option value=" + ethnicBackgroundAreas[i] + ">" + ethnicBackgroundAreas[i] + "</option>");
		jqElEthn.append(jqOpt); 
	}
	var jqElWebuse = $("#webuse");
	for(var i = 0, ilen = webuse.length; i < ilen; i++){
		var jqOpt = $("<label><input type='radio' name='webuse' value=" + webuse[i] + " required/>" + webuse[i] + "</label><br/>");
		jqElWebuse.append(jqOpt); 
	}
	$("#demographicsForm").submit(function(ev){
		var dataRaw = $(this).serializeArray();
		var data = {};
		$.each(dataRaw, function(i, field) {
			data[field.name] = field.value;
		});
		ap.port.emit("data", data);
		$("#demogrSubmit").val("Processing...").prop("disabled", true);
		setTimeout(function(){
			ap.port.emit("next", "let's roll!");
		}, 500);
		ev.preventDefault();
		return false;
	});
	// TODO remove after testing
	_tmpAutoFieldFiller();
})();
