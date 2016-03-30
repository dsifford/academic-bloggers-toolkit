export default {};

declare global {
  interface String {
      toTitleCase(): string
  }
  interface HTMLElement {
    showHide(option?: 'show'|'hide'): string
  }
}

String.prototype.toTitleCase = function(): string {
  let smallWords = /^(a|an|and|as|at|but|by|en|for|if|in|nor|of|on|or|per|the|to|vs?\.?|via)$/i;

  return this.replace(/[A-Za-z0-9\u00C0-\u00FF]+[^\s-]*/g, function(match, index, title){
    if (index > 0 && index + match.length !== title.length &&
      match.search(smallWords) > -1 && title.charAt(index - 2) !== ":" &&
      (title.charAt(index + match.length) !== '-' || title.charAt(index - 1) === '-') &&
      title.charAt(index - 1).search(/[^\s-]/) < 0) {
      return match.toLowerCase();
    }

    if (match.substr(1).search(/[A-Z]|\../) > -1) {
      return match;
    }

    return match.charAt(0).toUpperCase() + match.substr(1);
  });
};

HTMLElement.prototype.showHide = function(option?: 'show' | 'hide'): string {
  switch(option) {
    case 'show':
      this.style.display = '';
      break;
    case 'hide':
      this.style.display = 'none';
      break;
    default:
      this.style.display = this.style.display == 'none' ? '' : 'none';
  }
  return this.style.display;
}
