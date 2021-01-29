## CHANGELOG

All versions from newest to oldest:

**v4.2 (2021/01/29)**

- Replaced question mark in popup with the word "about" to clarify its use.
- Fix "latest version" saying there's a later version when this is not the case.

**v4.1 (2021/01/27)**

- Applying to join the WA will now notify you if your email address is already in use for another WA nation.
- Removed notifications shown immediately before a reload to prevent unintended confusion.
- Removed page refresh for applying to join the WA (unnecessary).
- Reset undefined keys to their defaults.
- Fixed "Region" shortcut not working when viewing another region's page.

**v4.0 (2021/01/21)**

* Removed deprecated usage of KeyboardEvent keyCode. A best attempt has been made to update user config, but unfortunately for a lot of "special" keyboard shortcuts this is simply not possible. This means users may have to configure some shortcuts after updating (look for "undefined" keys).
* Changed "Cross Endorse" functionality: it now endorses the next nation with each press. Nations to endorse are the nation in view, and each nation endorsing it. Nations which have already been endorsed show up green. There is a 6-second cooldown between each endorsement to comply with NS script limits. While endorsing manually is faster, this key is useful to provide visual feedback for which nations you still need to endorse, as it also tracks nations endorsed using "Endorse" in different tabs.
* Changed functionality of "Jump Point" to directly move there.
* Added a "Move to" field and button to move directly to a region at the top of the page (and a setting to disable it).
* "Move" can also trigger said button if the field is filled in, and you're not on a region's page.
* "WA: Delegate" navigates directly to the WA Delegate without going trough the region you're in.
* "WA: Apply/Join/Leave" applies for and resigns from the WA instantly without navigating to the WA page.
* "Prepare Switcher" makes use of direct move and instant WA apply/leave, reducing the amount of key presses required to 2. It can now also be used to move back and resign after operations.
* You will now see if there is a later version of Storm available in the popup menu.
* "?" in the popup-menu now redirects to Storm on GitHub (consolidating information to reduce maintenance).
* Added tooltips for Jump Point, Officer and Autoscroll to clarify their usage.
* Fixed Apply/Join/Leave triggering the "Login" button of the Switch menu.
* Fixed "stuck" shift key.
* Improved code structure.


**v3.1 (2020/02/14)**

* Fixed a critical mistake.


**v3.0 (2020/01/24)**

* Made all non-browser shortcuts customizable. Click a shortcut's button, then press a key to change it. It is automatically saved like the other settings (except Officer Role). Closing the popup menu while the key reads "Press a key" cancels the change.
* Added configuration for automatically scrolling down on a nation's page. By default it is now disabled. See "Auto-scroll nation page" in the popup menu.
* Changed README to ABOUT, as the keymap with full key descriptions was removed there.
* Removed the LAYOUT and README buttons. Click the question mark in the top-right of the popup window to see the ABOUT page. The LAYOUT can also be found there, but will only reflect the default keyboard shortcuts.
* Added tooltips to the popup with full key descriptions and extra information to replace the README. Hover over an item to see its tooltip.
* Added [K] as an extra refresh key. It is predictably located near [M] (the default to move) on all keyboard layouts.
* Added an on-page notification to replace the alert for setting a JP.
* Fixed and simplified no-template CSS.
* Removed JQuery dependency to increase performance by a few dozen milliseconds. Don't expect a miracle from this, the gain is negligible compared to the impact of your distance from NS' servers and quality of your internet connection. This change may have both fixed and introduced some unintended behaviours. If something appears to be wrong, or did not work as you expected it to, please report it.


**v2.6 (2020/01/18)**

* Added dropdown for jump points to extension menu. There you can select and delete JP's from among the saved regions. Remember, you can save and set a region as JP by pressing [Shift]+[P].
* Added configuration capability for the officer role name. The default role name is now simply "Officer".
* Bugfix (2) for Ctrl, Alt & Shift combinations (this time for real, hopefully :p).


**v2.5 (2020/01/13)**

* Hotfix to for Ctrl, Alt & Shift triggering an alert.


**v2.4 (2020/01/12)**

* Bugfix to for Ctrl+W opening delegate page (fixes Ctrl, Alt & Shift combinations in general).


**v2.3 (2019/06/13)**

* Hotfix (2) to disable extension in input fields.


**v2.2 (2019/06/13)**

* Hotfix to disable extension in input fields.


**v2.1 (2019/06/13)**

* Disabled extension on forum.nationstates.net


**v2.0 (2019/06/12)**

* Added features from Breeze++ v3.0.0 (Author: Vincent W. Drake)
* Re-enabled [Z] (Zombie Control)


**v1.9 (2019/06/11)**

* Show currently selected jump point in extension popup
* Added [Shift]+[P] to set custom region.
* Changed [P] from By the Sword to custom region.


**v1.8 (2018/08/26)**

* Changed [P] from The Pareven Isles to By the Sword.


**v1.7 (2018/07/09)**

* Name changed from AIR-Breeze to Storm. Icons changed.


**v1.6 (2018/04/28)**

* Added [F6] to copy the link to the current page
* Re-enabled [C]. It now opens the first 10 endorsers and can not be used more than once a minute. This satisfies NS script rules.
* Added a visual aid for reloading the reports page, and automatically set "Show reports from last ... hours" to 0.10
* Fixed the issue with trying to open the WA-Delegate's page using [W] immediately after changing regions.
* Solved the inherent browser problem with cached previous/next pages. If you use F7 or Backspace and F8 to navigate, you won't need to reload the page any more. You still have to reload the page if you use the back/forward buttons in your browser. This is so that AIR-Breeze does not interfere with basic browser functionality
* Published on https://chrome.google.com/webstore/detail/air-breeze/dbmojgocnaeejbjnjgkcpehdpgjnhhpo


**v1.5 (2018/04/17)**

* Disabled [C] as it broke the rules for automated tools. Extensions are not allowed to open more than 10 tabs per minute.
* Renamed the "Pilot" regional officer role to "Ace". It sounds better overall I think.
* A few things that aren't all that noteworthy have been fixed: the extension didn't need tabs permission, the keyboard layout image has been updated, the link to it from the full readme works again, and corrected a minor mistake in the CSS.


**v1.4 (2018/04/12)**

* Added [S] to go to Spear Danes
* Added [O] for regional officer key shortcuts (opens regional controls, appoints own nation with A-C-E-P, dismisses other nations when modifying)
* Added [P] to go to The Pareven Isles
* Re-purposed [B] for banning nations
* Added version to full readme and popup
* Made proper HTML page for full readme
* Improved looks


**v1.3 (2018/03/19)**

* Squashed a bug where if you pressed [J] or [L] to leave the WA it would press the wrong button and take you to https://www.nationstates.net/page=login


**v1.2 (2018/03/18)**

* Published on https://addons.mozilla.org/en-US/firefox/addon/air-breeze/


**v1.1 (2018/03/16)**

* Changed [W] to go to region's page if not already there
* Changed [D] to also be able to doss regions


**v1.0 (2018/03/15)**

* Forked from Breeze++ v2.1.4
* Added a popup readme (left-click the extension's button) and extension icon
* Added a keyboard layout image (see popup readme)
* Added [Backspace] to go to the previous page
* Added [F7] to go to the previous page
* Added [F8] to go to the next page
* Added [J] to apply/join/leave the WA
* Added [L] to apply/join/leave the WA
* Changed [C] to open nations endorsing the point instead of endorsing the point
* Changed [N] from refreshing page to opening own nation (press [F5] to refresh page)
* Changed [B] to relocate to The Pareven Isles instead of Spear Danes
* Removed [V] as an alternative key to doss
* Removed [<] to go back ([F7] and [Backspace now serve that function])
* Removed ['] to apply/join/leave the WA ([J] and [L] now serve that function)
* Disabled [Z] to open zombie control (will be re-enabled around halloween)
* Disabled [?] to file GHR (may be re-enabled by popular request)
