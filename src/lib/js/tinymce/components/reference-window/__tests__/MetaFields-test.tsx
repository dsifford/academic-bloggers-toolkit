jest.unmock('../MetaFields');

import * as React from 'react';
import { mount } from 'enzyme';
import * as sinon from 'sinon';
import { MetaFields } from '../MetaFields';
import ABT_i18n from '../../../../utils/Mocks';
window['ABT_i18n'] = ABT_i18n;

const testMeta: CSL.Data = {
    title: 'TEST',
};

const setup = (
    citationType: CSL.CitationType = 'article-journal',
    meta = testMeta
) => {
    const spy = sinon.spy();
    const component = mount(
        <MetaFields citationType={citationType} meta={meta} eventHandler={spy} />
    );
    return {
        component,
        eventHandler: spy,
        field: component.find('#title'),
        title: component.find('strong').text(),
    };
};

describe('<MetaFields />', () => {
    it('should render with the correct title', () => {
        const title1 = setup().title;
        expect(title1).toBe('Journal Article');

        const title2 = setup('article-magazine').title;
        expect(title2).toBe('Magazine Article');
    });

    it('should dispatch META_FIELD_CHANGE event when fields are changed', () => {
        const { field, eventHandler } = setup();
        field.simulate('change');
        expect(eventHandler.callCount).toBe(1);
        expect(eventHandler.firstCall.args[0].type).toBe('META_FIELD_CHANGE');
        expect(eventHandler.firstCall.args[0].detail).toEqual({ field: 'title', value: 'TEST' });
    });
});
