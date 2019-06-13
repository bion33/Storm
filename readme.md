# Storm README



## ABOUT

### Latest release: **v2.2**
[Firefox add-on](https://addons.mozilla.org/en-US/firefox/addon/storm-ns/versions/)<br>
[Chrome Installation Instructions](https://docs.google.com/document/d/103SyyFSHejWzWgktYLY7iP21Z5twQdy5-K9g5k5Yvys/edit?usp=sharing)<br>

Storm is a variant of Breeze++ with additional functionality. See the keylist and changelog for differences between the two.

| NSBreeze  | Breeze++         | Storm   |
|-----------|------------------|--------------|
| [Shizensky](http://nationstates.net/Shizensky) | [Vincent W. Drake](https://www.nationstates.net/nation=vincent_drake) | [Krypton Nova](https://www.nationstates.net/nation=krypton_nova) |

#### **Contribute/Collaborate:**
All help in making this extension better is welcome! Contact me if you have suggestions, or if you'd like to help with the code (HTML, CSS and JavaScript). I'm also open to suggestions for collaboration between similar extensions.

#### **Licence:**
[GNU GPLv3](https://www.gnu.org/licenses/gpl.html)

#### **Contact me:**

[bion@disroot.org](mailto:bion@disroot.org?Subject=Storm)
KN#4693 on Discord



## KEY LIST


Keys native to your browser included.


| **Key(s)** | Function |
| --- | --- |
| **[Enter]** | Confirm dialogue (useful in the World Assembly). |
| **[Backspace]** | Go to the previous page. |
| **[Spacebar]** | View the reports page. 2x for Ajax2 version. |
| **[Ctrl] + [Tab]** | Switch between browser tabs. |
| **[Ctrl] + [W]** | Close this browser tab. |
|  |  |
| **[F5]** | Refresh this page. |
| **[F6]** | Copy link to this page. |
| **[F7]** | Go to the previous page. |
| **[F8]** | Go to the next page. |
| **WARNING ⚠** | Reload the page after clicking back/forward browser buttons, otherwise hotkeys will not work and the page may be outdated. This is not needed for [F7], [Backspace] and [F8]. |
|  |  |
| **[1-5]** | Select and add the first nation in a happening (Activity or Reports Page) to your dossier. |
| **Keypad [1-5]** | Select and add the second nation in a happening (Activity or Reports Page) to your dossier. |
|  |  |
| **[A]** | View the activity page with the filters "World", "Move", "Member" and "Endorsements". This is ideal for spotting. Press again to view the activity page without filters. This is handy to see if a GCR is updating. |
| **[B]** | Ban and eject this nation. |
| **[C]** | Open the first 10 nations endorsing this nation in a separate tab. This function is limited to 10 nations to satisfy NS script rules. If your browser warns you about popups, be sure to allow them for "https://www.nationstates.net". |
| **[D]** | Add this nation or region to your dossier. |
| **[E]** | Endorse this nation. |
| **[G]** | What's updating? |
| **[H]** | Region Happenings |
| **[J]** | Apply/Join/Leave the World Assembly. |
| **[L]** | Apply/Join/Leave the World Assembly. |
| **[M]** | Move to this region. |
| **[N]** | The nation you're logged into. |
| **[O]** | Opens regional controls. There, press to appoint yourself "Ace" with permissions over Appearance, Communications, Embassies and Polls. If you modify another officer, press to dismiss them. |
| **[P]** | Open jump point. Press again to move there. Hold shift and this key to set your custom jump point. Default: Spear Danes. |
| **[S]** | Prepare Switchers (press 4 times). |
| **[T]** | Toggle Templates on and off. |
| **[U]** | A quick way to check if your nation has updated. |
| **[W]** | Opens the region you are in, when pressed there goes to its WA Delegate. |
| **[X]** | Open your dossier. Press again to clear the nations in it. |
| **[Z]** | Zombie Control |





 

## CHANGELOG

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
