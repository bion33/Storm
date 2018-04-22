# AIR-Breeze README



## ABOUT

### Latest release: **v1.5**
### WIP: **v1.6**

AIR-Breeze is a variant of Breeze++ for [AIR Force](https://www.nationstates.net/region=AIR).

| NSBreeze  | Breeze++         | AIR-Breeze   |
|-----------|------------------|--------------|
| [Shizensky](http://nationstates.net/Shizensky) | [Vincent W. Drake](https://www.nationstates.net/nation=vincent_drake) | [Krypton Nova](https://www.nationstates.net/nation=krypton_nova) |

#### **Contribute/Collaborate:**
All help in making this extension better is welcome! Contact me if you have suggestions, or if you'd like to help with the code (HTML, CSS and JavaScript). I'm also open to suggestions for collaboration between similar extensions.

#### **Licence:**
[GNU GPLv3](https://www.gnu.org/licenses/gpl.html)

#### **Contact me:**

[bion3@outlook.com](mailto:bion3@outlook.com?Subject=AIR-Breeze)
KN#4693 on Discord



## KEY LIST


Keys native to your browser included.


| **Key(s)** | Function |
| --- | --- |
| **[Enter]** | Confirm dialogue (useful in the World Assembly). |
| **[Backspace]** | Go to the previous page. |
| **[Spacebar]** | View the reports page. |
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
| **[J]** | Apply/Join/Leave the World Assembly. |
| **[L]** | Apply/Join/Leave the World Assembly. |
| **[M]** | Move to this region. |
| **[N]** | The nation you're logged into. |
| **[O]** | Opens regional controls. There, press to appoint yourself "Pilot" with permissions over Appearance, Communications, Embassies and Polls. If you modify another officer, press to dismiss them. |
| **[P]** | Open The Pareven Isles. Press again to move there. |
| **[R]** | The region your nation is in. |
| **[S]** | Open Spear Danes. Press again to move there. |
| **[U]** | A quick way to check if your nation has updated. |
| **[W]** | Opens the region you are in, when pressed there goes to its WA Delegate. |
| **[X]** | Open your dossier. Press again to clear the nations in it. |





 

## CHANGELOG


**WIP v1.6 (2018/04/??)**

* Added [F6] to copy the link to the current page
* Re-enabled [C]. It now opens the first 10 endorsers. This satisfies NS script rules as [C] is not intended to be pressed more than once a minute.
* Added a visual aid for reloading the reports page, and automatically set "Show reports from last ... hours" to 0.10
* Fixed the issue with trying to open the WA-Delegate's page using [W] immediately after changing regions.
* Solved the inherent browser problem with cached previous/next pages. If you use F7 or Backspace and F8 to navigate, you won't need to reload the page any more. You still have to reload the page if you use the back/forward buttons in your browser. This is so that AIR-Breeze does not interfere with basic browser functionality


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

* Published


**v1.1 (2018/03/16)**

* Changed [W] to go to region's page if not already there
* Changed [D] to also be able to doss regions


**v1.0 (2018/03/15)**

* Forked from Breeze++
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
* Removed [
