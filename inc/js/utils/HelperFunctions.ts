

/**
 * Function that takes a sorted array of integers as input and returns
 * an inline citation string representation of the numbers.
 *
 * Example: [1,3,4,5,10] => "1,3-5,10"
 *
 * @param  {number[]} numArr Sorted array of integers.
 * @returns {string} A formatted inline citation string.
 */
export function parseInlineCitationString(numArr: number[]): string {
  if (numArr.length === 0) { return ''; }

  let output: string = numArr[0].toString();

  for (let i = 1; i < numArr.length; i++) {
    switch (output[output.length - 1]) {
      case ',':
        output += numArr[i];
        break;
      case '-':
        if (numArr[i+1] === numArr[i] + 1) { break; }
        if (i === numArr.length - 1) { output += numArr[i]; break;}
        output += numArr[i] + ',';
        break;
      default:
        let lastNum = parseInt(output.split(',')[output.split(',').length - 1]);
        if (lastNum === numArr[i] - 1 && numArr[i + 1] === numArr[i] + 1) {
            output += '-';
            break;
        }
        output += ',' + numArr[i];
    }
  }

  return output;
}

/**
 * Function that takes an inline citation string and returns an array of
 * integers for that string.
 *
 * Example: "1-3,6,8-10" => [1,2,3,6,8,9,10]
 *
 * @param  {string} input An inline citation string.
 * @returns {number[]} An array of integers that represent the input string.
 */
export function parseCitationNumArray(input: string): number[] {
  let x = input.split(',');
  let output: number[] = [];

	if (x.length === 0 || (x.length === 1 && x[0] === '')) { return []; }

	for (let i = 0; i < x.length; i++) {
		switch (x[i].match('-')) {
    case null:
      output.push(parseInt(x[i]));
      break;
    default:
      for (let j = parseInt(x[i].split('-')[0]); j <= parseInt(x[i].split('-')[1]); j++) {
        output.push(j);
      }
  	}
	}

	return output;
}
