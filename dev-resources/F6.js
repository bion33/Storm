(function() {
	$(document).keyup(function(e) {
		// [F6] Copies link in address bar.
		if (e.keyCode == 67){
			// e.preventDefault();
			// Waiting for this to become the standard
			async function copyPageUrl() {
				try {
					await navigator.clipboard.writeText(location.href);
					console.log('Page URL copied to clipboard');
				} catch (err) {
					console.error('Failed to copy: ', err);
				}
			}
		}
	});
})();