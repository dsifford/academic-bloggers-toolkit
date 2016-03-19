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

			return '<span><strong>' + el + '.</strong> ' + citation + '</span><br>';
		});
		citations[i].dataset.citations = citeNums.join('');

		// Create tooltip
		citations[i].addEventListener('mouseover', function(e) {
			var tooltip = document.createElement('div');
			tooltip.id = tooltip.className = 'abt_tooltip';
			tooltip.innerHTML = e.currentTarget.dataset.citations;
			tooltip.style.position = 'absolute';
			tooltip.style.visibility = 'hidden';

			document.body.appendChild(tooltip);
			tooltip.style.top = (e.pageY + 20) + 'px';
			tooltip.style.left = (e.pageX - 20) + 'px';

			tooltip.style.visibility = '';
		});

		// Destroy tooltip
		citations[i].addEventListener('mouseout', function() {
			document.getElementById('abt_tooltip').remove();
		});
	}

}
