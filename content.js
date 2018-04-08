(function() {
	// Detect Shift, Control and Alt keys being pressed, as well as any key
	var shifted = false;
	var controlled = false;
	var alternated = false;
	var pressed = false;
	$(document).keydown(function(f) {
		shifted = f.shiftKey;
        controlled = f.ctrlKey;
		alternated = f.altKey;
		pressed = f;
	});
	// Continually refreshes reports page unless a key is pressed
	var current_url = $(location).attr('href');
	if (current_url == "https://www.nationstates.net/template-overall=none/page=reports"){
		if (pressed == false) {
			// setTimeout(function(){ window.location.reload(false); }, 1000);
		}
		else {
			window.alert("something was pressed")
		}
	}
	$(document).keyup(function(e) {
        if (shifted || controlled || alternated){
			return;
        }
		else {
			if ($("input,textarea").is(":focus")){
				return;
			}
			// [Enter] confirms dialogs in Chrome and Firefox by default. No code required.
			// [Ctrl]+[Tab] switches between browser tabs in Chrome and Firefox by default. No code required.
			// [Space] Reports Page (no template) with auto-refresh.
			else if (e.keyCode == 32 && e.target == document.body) {
 				e.preventDefault();
				window.location.href = "https://www.nationstates.net/template-overall=none/page=reports";
			}
			// [F5] Refreshes window in both Chrome and Firefox by default. No code required.
			// [F6] Planned to copy link to current page.
			// [F7] & [Backspace] Goes to previous page. 
			// [F7] Shortcut for caret browsing in Firefox.
			// [Backspace] Default in Firefox but not used in Chrome.
			else if (e.keyCode == 118 || e.keyCode == 8){
				e.preventDefault();
				window.history.back();
			}
			// [F8] Goes to next page. Unused by both Chrome and Firefox.
			else if (e.keyCode == 119){
				window.history.forward();
			}
			// [1] Add to Dossier
			else if (e.keyCode == 49){
				var current_url = $(location).attr('href');
				if (current_url == "https://www.nationstates.net/template-overall=none/page=reports"){
					$('li a:nth-of-type(1)')[0].click(); 
					$("li a:nth-of-type(1)").eq(0).css("background-color", "yellow");
				} 
				if (current_url == "https://www.nationstates.net/page=activity/view=world/filter=move+member+endo"){
					$('#reports li a:nth-of-type(1)')[0].click(); 
					$("#reports li a:nth-of-type(1)").eq(0).css("background-color", "yellow");
				} 
				else {
				$('.button[name=action]').first().trigger('click'); 
				}
			}
			// [2] Add to Dossier
			else if (e.keyCode == 50){
				var current_url = $(location).attr('href');
				if (current_url == "https://www.nationstates.net/template-overall=none/page=reports"){
					$('li a:nth-of-type(1)')[1].click(); 
					$("li a:nth-of-type(1)").eq(1).css("background-color", "yellow");
				} 
				if (current_url == "https://www.nationstates.net/page=activity/view=world/filter=move+member+endo"){
					$('#reports li a:nth-of-type(1)')[1].click(); 
					$("#reports li a:nth-of-type(1)").eq(1).css("background-color", "yellow");
				} 
				else {
				$('.button[name=action]').first().trigger('click'); 
				}
			}
			// [3] Add to Dossier
			else if (e.keyCode == 51){
				var current_url = $(location).attr('href');
				if (current_url == "https://www.nationstates.net/template-overall=none/page=reports"){
					$('li a:nth-of-type(1)')[2].click(); 
					$("li a:nth-of-type(1)").eq(2).css("background-color", "yellow");
				} 
				if (current_url == "https://www.nationstates.net/page=activity/view=world/filter=move+member+endo"){
					$('#reports li a:nth-of-type(1)')[2].click(); 
					$("#reports li a:nth-of-type(1)").eq(2).css("background-color", "yellow");
				} 
				else {
				$('.button[name=action]').first().trigger('click'); 
				}
			}
			// [4] Add to Dossier
			else if (e.keyCode == 52){
				var current_url = $(location).attr('href');
				if (current_url == "https://www.nationstates.net/template-overall=none/page=reports"){
					$('li a:nth-of-type(1)')[3].click(); 
					$("li a:nth-of-type(1)").eq(3).css("background-color", "yellow");
				} 
				if (current_url == "https://www.nationstates.net/page=activity/view=world/filter=move+member+endo"){
					$('#reports li a:nth-of-type(1)')[3].click(); 
					$("#reports li a:nth-of-type(1)").eq(3).css("background-color", "yellow");
				} 
				else {
				$('.button[name=action]').first().trigger('click'); 
				}
			}
			// [5] Add to Dossier
			else if (e.keyCode == 53){
				var current_url = $(location).attr('href');
				if (current_url == "https://www.nationstates.net/template-overall=none/page=reports"){
					$('li a:nth-of-type(1)')[4].click(); 
					$("li a:nth-of-type(1)").eq(4).css("background-color", "yellow");
				} 
				if (current_url == "https://www.nationstates.net/page=activity/view=world/filter=move+member+endo"){
					$('#reports li a:nth-of-type(1)')[4].click(); 
					$("#reports li a:nth-of-type(1)").eq(4).css("background-color", "yellow");
				} 
				else {
				$('.button[name=action]').first().trigger('click'); 
				}
			}
			// [Keypad 1] Add to Dossier
			else if (e.keyCode == 97){
				var current_url = $(location).attr('href');
				if (current_url == "https://www.nationstates.net/template-overall=none/page=reports"){
					$('li a:nth-of-type(2)')[0].click(); 
					$("li a:nth-of-type(2)").eq(0).css("background-color", "yellow");
				} 
				if (current_url == "https://www.nationstates.net/page=activity/view=world/filter=move+member+endo"){
					$('#reports li a:nth-of-type(2)')[0].click(); 
					$("#reports li a:nth-of-type(2)").eq(0).css("background-color", "yellow");
				} 
				else {
				$('.button[name=action]').first().trigger('click'); 
				}
			}
			// [Keypad 2] Add to Dossier
			else if (e.keyCode == 98){
				var current_url = $(location).attr('href');
				if (current_url == "https://www.nationstates.net/template-overall=none/page=reports"){
					$('li a:nth-of-type(2)')[1].click(); 
					$("li a:nth-of-type(2)").eq(1).css("background-color", "yellow");
				} 
				if (current_url == "https://www.nationstates.net/page=activity/view=world/filter=move+member+endo"){
					$('#reports li a:nth-of-type(2)')[1].click(); 
					$("#reports li a:nth-of-type(2)").eq(1).css("background-color", "yellow");
				} 
				else {
				$('.button[name=action]').first().trigger('click'); 
				}
			}
			// [Keypad 3] Add to Dossier
			else if (e.keyCode == 99){
				var current_url = $(location).attr('href');
				if (current_url == "https://www.nationstates.net/template-overall=none/page=reports"){
					$('li a:nth-of-type(2)')[2].click(); 
					$("li a:nth-of-type(2)").eq(2).css("background-color", "yellow");
				} 
				if (current_url == "https://www.nationstates.net/page=activity/view=world/filter=move+member+endo"){
					$('#reports li a:nth-of-type(2)')[2].click(); 
					$("#reports li a:nth-of-type(2)").eq(2).css("background-color", "yellow");
				} 
				else {
				$('.button[name=action]').first().trigger('click'); 
				}
			}
			// [Keypad 4] Add to Dossier
			else if (e.keyCode == 100){
				var current_url = $(location).attr('href');
				if (current_url == "https://www.nationstates.net/template-overall=none/page=reports"){
					$('li a:nth-of-type(2)')[3].click(); 
					$("li a:nth-of-type(2)").eq(3).css("background-color", "yellow");
				} 
				if (current_url == "https://www.nationstates.net/page=activity/view=world/filter=move+member+endo"){
					$('#reports li a:nth-of-type(2)')[3].click(); 
					$("#reports li a:nth-of-type(2)").eq(3).css("background-color", "yellow");
				} 
				else {
				$('.button[name=action]').first().trigger('click'); 
				}
			}
			// [Keypad 5] Add to Dossier
			else if (e.keyCode == 101){
				var current_url = $(location).attr('href');
				if (current_url == "https://www.nationstates.net/template-overall=none/page=reports"){
					$('li a:nth-of-type(2)')[4].click(); 
					$("li a:nth-of-type(2)").eq(4).css("background-color", "yellow");
				} 
				if (current_url == "https://www.nationstates.net/page=activity/view=world/filter=move+member+endo"){
					$('#reports li a:nth-of-type(2)')[4].click(); 
					$("#reports li a:nth-of-type(2)").eq(4).css("background-color", "yellow");
				} 
				else {
				$('.button[name=action]').first().trigger('click'); 
				}
			}
			// [W] WA Delegate
			else if(e.keyCode == 87){
				var current_url = $(location).attr('href');
				var region = 'region='
				if (current_url.indexOf(region) !== -1){
					// On region's page
					$('#content').children('p:nth-child(2)').children('a.nlink:first')[0].click();
				}
				else {
					// Go to region's page
					if ($('#paneltitle').length > 0){
						// Using Rift
						$('#panel').children('.panelcontent').children('.menu').children('li').children('a')[0].click();
					}
					else{
						// Other themes
						$('#panel').children('ul').children('li').children('a')[1].click();
					}	 
				}
			}
			// [E] Endorse
			else if (e.keyCode == 69){
				if ($('input[name=action]').val() == "endorse") $('button.endorse').first().trigger('click');  
			}
			// [R] Region
			else if (e.keyCode == 82){
				if ($('#paneltitle').length > 0){
					// Using Rift
					$('#panel').children('.panelcontent').children('.menu').children('li').children('a')[0].click();
				}
				else{
					// Other themes
					$('#panel').children('ul').children('li').children('a')[1].click();
				}	 
			}
			// [U] Did My Nation Update?
			else if (e.keyCode == 85){
				window.location.href = "https://www.nationstates.net/page=ajax2/a=reports/view=self/filter=change";
			}
			// [A] Activity Feed With Chasing Filters, Activity Feed Without (2x)
			else if (e.keyCode == 65){
				var current_url = $(location).attr('href');
				if (current_url == "https://www.nationstates.net/page=activity/view=world"){
					window.location.href = "https://www.nationstates.net/page=activity/view=world/filter=move+member+endo";
				}
				else if (current_url == "https://www.nationstates.net/page=activity/view=world/filter=move+member+endo"){
					window.location.href = "https://www.nationstates.net/page=activity/view=world";
				}
				else {
					window.location.href = "https://www.nationstates.net/page=activity/view=world/filter=move+member+endo";
				}
			}
			// [S] Open Spear Danes, Move to Spear Danes (2x)
			else if (e.keyCode == 83){
				var current_url = $(location).attr('href');
				if (current_url == "https://www.nationstates.net/region=spear_danes"){
					$('.button[name=move_region], input[name=move_region]').first().trigger('click');
				}
				else {	  
					window.location.href = "https://www.nationstates.net/region=spear_danes";
				}
			}
			// [D] Add to Dossier
			else if (e.keyCode == 68){
				var current_url = $(location).attr('href');
				var region = 'region='
				if (current_url.indexOf(region) !== -1){
					// On region's page
					$('.button[name=add_to_dossier]').first().trigger('click'); 
				}
				else {
					// Elsewhere
					$('.button[name=action]').first().trigger('click'); 
				}
			} 
			// [J] & [L] Open WA, Apply/Join/Resign in the WA (2x)
			else if (e.keyCode == 74 || e.keyCode == 76){
				var current_url = $(location).attr('href');
				if (current_url == "https://www.nationstates.net/page=un"){
					if ($('#content').length > 0){
						// Modern themes
						$('#content').children('form').children('p').children('button').trigger('click');
					}
					else{
						// Using Antiquity
						$('#main').children('form').children('p').children('button').trigger('click');
					}	 
				}
				else {
					window.location.href = "https://www.nationstates.net/page=un";
				}
			}
			// [X] Open Dossier, Clear Dossier (2x)
			else if (e.keyCode == 88){
				var current_url = $(location).attr('href');
				if (current_url == "https://www.nationstates.net/page=dossier"){
					$('.button[name=clear_dossier]').first().trigger('click');
				}
				else {
					window.location.href = "https://www.nationstates.net/page=dossier";
				}
			}
			// [C] Open nations to cross
			else if (e.keyCode == 67){
				var cross = $('.unbox').children('p').children('a');
				for (var i = 0; i < cross.length; i++) {
						cross[i].target = "_blank";
						cross[i].click();
				}
			}
			// [B] Open The Pareven Isles, Move to The Pareven Isles (2x)
			else if (e.keyCode == 66){
				var current_url = $(location).attr('href');
				if (current_url == "https://www.nationstates.net/region=the_pareven_isles"){
					$('.button[name=move_region], input[name=move_region]').first().trigger('click');
				}
				else {	  
					window.location.href = "https://www.nationstates.net/region=the_pareven_isles";
				}
			}
			// [N] My Nation
			else if (e.keyCode == 78){
				window.location.href = "https://www.nationstates.net"; 
			}
			// [M] Move, Chase Move (2x)
			else if (e.keyCode == 77){
				var current_url = $(location).attr('href');
				if (current_url == "https://www.nationstates.net/template-overall=none/page=reports"){
					$('li a:nth-of-type(3)')[0].click(); 
					$("li a:nth-of-type(3)").eq(0).css("background-color", "yellow");
				} 
				else {
					
					$('.button[name=move_region], input[name=move_region]').first().trigger('click');
				}
			}
			// Disabled Hotkeys
			// [Z] Zombie Control
			// else if (e.keyCode == 90){
			//		window.location.href = "https://www.nationstates.net/page=zombie_control";
			// }
			// [H] File GHR
			// else if (e.keyCode == 72){
			//		window.location.href = "https://www.nationstates.net/page=help";
			// }
		}
	});
})();
