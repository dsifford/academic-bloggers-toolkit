import * as tinycolor from 'tinycolor2';

export const colors = {
    get blue() {
        return tinycolor('#0085ba');
    },
    get border() {
        return tinycolor('rgba(0, 0, 0, .12)');
    },
    get dark_gray() {
        return tinycolor('#555');
    },
    get disabled() {
        return tinycolor('#a0a5aa');
    },
    get font_light() {
        return tinycolor('rgba(0, 0, 0, .54)');
    },
    get light_gray() {
        return tinycolor('#f5f5f5');
    },
    get tooltip_gray() {
        return tinycolor('rgba(66, 66, 66, .9)');
    },
};

export const shadows = {
    depth_1: `0 1px 3px rgba(0, 0, 0, .12), 0 1px 2px rgba(0, 0, 0, .24)`,
    depth_2: `0 3px 6px rgba(0, 0, 0, .16), 0 3px 6px rgba(0, 0, 0, .23)`,
    depth_3: `0 10px 20px rgba(0, 0, 0, .19), 0 6px 6px rgba(0, 0, 0, .23)`,
    depth_4: `0 14px 28px rgba(0, 0, 0, .25), 0 10px 10px rgba(0, 0, 0, .22)`,
    depth_5: `0 19px 38px rgba(0, 0, 0, .30), 0 15px 12px rgba(0, 0, 0, .22)`,
    citation_tooltip: `0 0 20px rgba(0, 0, 0, .19), 0 6px 6px rgba(0, 0, 0, .23)`,
    transition: `all .3s cubic-bezier(.25, .8, .25, 1)`,
    top_border: `0 -1px 0 rgba(16, 22, 26, .10)`,
};

class Transitions {
    shadows: string;
    buttons: string;
    private curves: {
        fast_out_slow_in: string;
        linear_out_slow_in: string;
        fast_out_linear_in: string;
        default: string; // tslint:disable-line
    };
    constructor() {
        this.curves = {
            fast_out_slow_in: `cubic-bezier(0.4, 0, 0.2, 1)`,
            linear_out_slow_in: `cubic-bezier(0, 0, 0.2, 1)`,
            fast_out_linear_in: `cubic-bezier(0.4, 0, 1, 1)`,
            default: '',
        };
        this.curves.default = this.curves.fast_out_slow_in;
        this.shadows = `all 0.3s cubic-bezier(.25,.8,.25,1)`;
        this.buttons = `
            box-shadow .2s ${this.curves.fast_out_linear_in},
            background-color .2s ${this.curves.default},
            color .2s ${this.curves.default}
        `;
    }
}

export const transitions = new Transitions();

export const outline = '1.1px auto rgba(19, 124, 189, 0.5)';
