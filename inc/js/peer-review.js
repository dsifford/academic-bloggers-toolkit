if (document.readyState != 'loading'){
	blogPageJS();
} else {
	document.addEventListener('DOMContentLoaded', blogPageJS);
}


function blogPageJS() {

	// Accordion Boxes
	var PRboxes = document.querySelectorAll('#abt_PR_boxes > h3');

	for (var i = 0; i < PRboxes.length; i++) {
		PRboxes[i].nextSibling.style.display = 'none';

		PRboxes[i].addEventListener('click', function(e) {

			var targetElement = e.target.nextSibling;
			var siblings = e.target.parentNode.children;

			// If the target is visible already, hide and exit
			if (targetElement.style.display != 'none') {
				targetElement.style.display = 'none';
				return;
			}

			for (var i = 0; i < siblings.length; i++) {
				if (siblings[i].tagName != 'DIV') {
					continue;
				}
				siblings[i].style.display = 'none'
			}

			targetElement.style.display = '';

		});

	}


	var orderedLists = document.getElementsByTagName('ol');
	var referenceList;
	for (var i = (orderedLists.length - 1); i >= 0; i--) {
		if (orderedLists[i].parentNode.className !== 'abt_chat_bubble') {
			referenceList = orderedLists[i];
			break;
		}
	}

	var citations = document.querySelectorAll('span.cite');
	for (var i = 0; i < citations.length; i++) {

		// Parse citations data attribute
		var citeNums = JSON.parse(citations[i].dataset.reflist);
		citeNums = citeNums.map(function(el) {

			// Correct for zero-based index
			var correctedNum = parseInt(el) - 1;

			// Handle error silently if number outside the indicies of the reference list
			if (!referenceList.children[correctedNum]) {
				return;
			}

			// Remove URLs
			var citation = referenceList.children[correctedNum].innerHTML.replace(/<a.+target="_blank">/, '').replace(/<\/a>/, '');

			return '<div style="display: flex;"><span><strong>' + el + '.</strong> ' + citation + '</span></div>';
		});
		citations[i].dataset.citations = citeNums.join('');

		// Create tooltip event handlers based on device
		if (isTouchDevice()) {
			citations[i].addEventListener('touchstart', createTooltip);
			citations[i].addEventListener('touchend', destroyTooltip);
		} else {
			citations[i].addEventListener('mouseover', createTooltip);
			citations[i].addEventListener('mouseout', destroyTooltip);
		}

	}

	// ==================================================
	//               HELPER FUNCTIONS
	// ==================================================

	function isTouchDevice(){
    return true == ("ontouchstart" in window || window.DocumentTouch && document instanceof DocumentTouch);
  }

	function createTooltip(e) {

		if(document.getElementById('abt_tooltip') !== null) {
  		document.getElementById('abt_tooltip').remove();
		}

		var tooltip = document.createElement('div');
		tooltip.className = 'abt_tooltip';
		tooltip.innerHTML = e.currentTarget.dataset.citations;
		tooltip.style.visibility = 'hidden';

		if (isTouchDevice()) {

			var container = document.createElement('div');
			container.id = 'abt_tooltip';
			container.style.cssText = "position: absolute; display: flex; " +
				"visibility: hidden; justify-content: center; left: 0; right: 0; margin: auto;";
			container.appendChild(tooltip);
			tooltip.style.cssText = "position: relative; display: flex;" +
				"flex-direction: column; max-width: 95%;";

			document.body.appendChild(container);
			container.style.top = (e.touches[0].pageY + 10) + 'px';
			container.style.visibility = tooltip.style.visibility = '';

		} else {
			tooltip.id = 'abt_tooltip';
			tooltip.style.position = 'absolute';

			document.body.appendChild(tooltip);
			tooltip.style.top = (e.pageY + 20) + 'px';
			tooltip.style.left = (e.pageX - 20) + 'px';
			tooltip.style.visibility = '';
		}

	};

	function destroyTooltip() {
		document.getElementById('abt_tooltip').remove();
	}

}
