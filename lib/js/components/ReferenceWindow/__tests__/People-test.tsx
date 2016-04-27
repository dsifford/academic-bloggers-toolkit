jest.unmock('../People');

import * as React from 'react';
import { shallow, mount } from 'enzyme';
import * as sinon from 'sinon';
import { People } from '../People';

function setup(citationType: CSL.CitationType = 'article') {
    const eventHandler = sinon.spy();
    const component = shallow(
        <People citationType={citationType} eventHandler={eventHandler} people={[]} />
    );
    return {
        eventHandler,
        component,
        addButton: component.find('#add-person')
    }
}

describe('<People />', () => {

    it('should dispatch ADD_PERSON event when add button is clicked', () => {

        const { addButton, eventHandler } = setup();

        addButton.simulate('click');
        addButton.simulate('click');
        addButton.simulate('click');

        expect(eventHandler.callCount).toBe(3);
        expect(eventHandler.getCall(0).args[0].type).toBe('ADD_PERSON');
        expect(eventHandler.getCall(1).args[0].type).toBe('ADD_PERSON');
        expect(eventHandler.getCall(2).args[0].type).toBe('ADD_PERSON');

    });
    it('should dispatch REMOVE_PERSON event when remove button is clicked', () => {

        // const { addButton, eventHandler } = setup();


        /** NOTE: Waiting on enzyme to correct an error before this works. */
        // const spy = sinon.spy();
        // const wrapper = mount(
        //     <People citationType='article' eventHandler={spy} people={[{ type: 'author', family: 'asdfadsfasd', given: 'asdfasdf'}]} />
        // );
        //
        // const removeButton = wrapper.find('input');
        // console.log(removeButton)
        //
        // removeButton.simulate('click');
        // expect(spy.getCall(0).args[0].type).toBe('REMOVE_PERSON');
        // expect(spy.getCall(0).args[0].detail).toBe(2);

    })
});
