var ABT_Frontend;
(function (ABT_Frontend) {
    var Accordion = (function () {
        function Accordion() {
            this._headings = document.querySelectorAll('#abt_PR_boxes > h3');
            for (var _i = 0, _a = this._headings; _i < _a.length; _i++) {
                var heading = _a[_i];
                var reviewContent = heading.nextSibling;
                reviewContent.style.display = 'none';
                heading.addEventListener('click', this._clickHandler);
            }
        }
        Accordion.prototype._clickHandler = function (e) {
            var targetContent = e.srcElement.nextSibling;
            if (targetContent.style.display != 'none') {
                targetContent.style.display = 'none';
                return;
            }
            var accordionNodes = e.srcElement.parentElement.childNodes;
            var element;
            for (var _i = 0, _a = accordionNodes; _i < _a.length; _i++) {
                element = _a[_i];
                if (element.tagName != 'DIV') {
                    continue;
                }
                if (element.previousSibling === e.srcElement) {
                    element.style.display = '';
                    continue;
                }
                element.style.display = 'none';
            }
        };
        return Accordion;
    }());
    ABT_Frontend.Accordion = Accordion;
    var Citations = (function () {
        function Citations() {
            var referenceList = this._getReferenceList();
            var citationList = document.querySelectorAll('span.cite');
            var citation;
            for (var _i = 0, _a = citationList; _i < _a.length; _i++) {
                citation = _a[_i];
                var citeNums = JSON.parse(citation.dataset['reflist']);
                var citationHTML = citeNums.map(function (citeNum) {
                    citeNum--;
                    if (!referenceList.children[citeNum]) {
                        return;
                    }
                    return ("<div style=\"display: flex;\">" +
                        "<span>" +
                        ("<strong>" + (citeNum + 1) + ". </strong>") +
                        ("" + referenceList.children[citeNum].innerHTML) +
                        "</span>" +
                        "</div>");
                });
                citation.dataset['citations'] = citationHTML.join('');
                if (this._isTouchDevice()) {
                    citation.addEventListener('touchstart', this._createTooltip.bind(this));
                }
                else {
                    citation.addEventListener('mouseover', this._createTooltip.bind(this));
                    citation.addEventListener('mouseout', this._destroyTooltip);
                }
            }
        }
        Citations.prototype._getReferenceList = function () {
            var orderedLists = document.getElementsByTagName('ol');
            for (var i = (orderedLists.length - 1); i >= 0; i--) {
                if (orderedLists[i].parentElement.className !== 'abt_chat_bubble') {
                    return orderedLists[i];
                }
            }
        };
        Citations.prototype._isTouchDevice = function () {
            return true == ("ontouchstart" in window || window.DocumentTouch && document instanceof DocumentTouch);
        };
        Citations.prototype._createTooltip = function (e) {
            clearTimeout(Citations.timer);
            var preExistingTooltip = document.getElementById('abt_tooltip');
            if (preExistingTooltip !== null) {
                preExistingTooltip.remove();
            }
            var rect = e.srcElement.getBoundingClientRect();
            var tooltip = document.createElement('div');
            tooltip.className = tooltip.id = 'abt_tooltip';
            tooltip.innerHTML = e.srcElement.getAttribute('data-citations');
            tooltip.style.visibility = 'hidden';
            var tooltipArrow = document.createElement('div');
            tooltipArrow.className = 'abt_tooltip_arrow';
            if (this._isTouchDevice()) {
                var closeButton = document.createElement('div');
                closeButton.className = 'abt_tooltip_touch_close';
                closeButton.addEventListener('touchend', function () { return tooltip.remove(); });
                tooltip.style.left = '0';
                tooltip.style.right = '0';
                tooltip.style.maxWidth = '90%';
                tooltip.appendChild(closeButton);
                document.body.appendChild(tooltip);
                tooltip.appendChild(tooltipArrow);
                tooltipArrow.style.left = "calc(" + rect.left + "px - 5% + " + ((rect.right - rect.left) / 2) + "px - 3px)";
            }
            else {
                tooltipArrow.style.left = '50%';
                tooltip.appendChild(tooltipArrow);
                document.body.appendChild(tooltip);
                tooltip.style.marginRight = '10px';
                tooltip.style.maxWidth = (500 > ((rect.left * 2) + ((rect.right - rect.left) / 2))) ? (rect.left * 2) + 'px' : '500px';
                tooltip.style.left = rect.left + ((rect.right - rect.left) / 2) - (tooltip.clientWidth / 2) + 'px';
                tooltip.addEventListener('mouseover', function () { return clearTimeout(Citations.timer); });
                tooltip.addEventListener('mouseout', this._destroyTooltip);
            }
            if ((rect.top - tooltip.offsetHeight) < 0) {
                tooltip.style.top = (rect.bottom + window.scrollY + 5) + 'px';
                tooltipArrow.style.top = '-15px';
                tooltipArrow.style.borderColor = 'transparent transparent #fff';
            }
            else {
                tooltip.style.top = (rect.top + window.scrollY - tooltip.offsetHeight - 5) + 'px';
                tooltipArrow.style.bottom = '-15px';
                tooltipArrow.style.borderColor = '#fff transparent transparent';
            }
            tooltip.style.visibility = '';
        };
        Citations.prototype._destroyTooltip = function () {
            Citations.timer = setTimeout(function () {
                document.getElementById('abt_tooltip').remove();
            }, 200);
        };
        return Citations;
    }());
    ABT_Frontend.Citations = Citations;
})(ABT_Frontend || (ABT_Frontend = {}));
if (document.readyState != 'loading') {
    frontendJS();
}
else {
    document.addEventListener('DOMContentLoaded', frontendJS);
}
function frontendJS() {
    new ABT_Frontend.Citations();
    new ABT_Frontend.Accordion();
}
