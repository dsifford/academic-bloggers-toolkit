jest.mock('../../../../utils/Modal');
import * as React from 'react';
import { mount } from 'enzyme';
import { EditReferenceWindow } from '../EditReferenceWindow';

describe('<EditReferenceWindow />', () => {
    beforeAll(() => {
        top.tinyMCE = {
            activeEditor: {
                windowManager: {
                    close: jest.fn(),
                    setParams: jest.fn(),
                    windows: [
                        {
                            settings: {
                                params: {
                                    reference: {
                                        author: [
                                            { family: 'Doe', given: 'John' },
                                            { family: 'Smith', given: 'Jane' },
                                        ],
                                        id: 'test-id',
                                        issued: {
                                            'date-parts': [
                                                ['2016', '05', '23'],
                                            ]
                                        },
                                        title: 'Test Title',
                                        type: 'article-journal',
                                    },
                                }
                            }
                        }
                    ],
                }
            }
        } as any;
    });

    const setup = () => {
        const component = mount(
            <EditReferenceWindow />
        );
        return {
            component,
            instance: component.instance() as any,
            wm: top.tinyMCE.activeEditor.windowManager,
        };
    };

    it('should initialize', () => {
        const { instance } = setup();
        expect(instance.people.length).toBe(2);
        expect(instance.primitives.get('issued')).toBe('2016/05/23');
    });
    it('should trigger empty render if loading', () => {
        const { component, instance } = setup();
        instance.loading = true;
        expect(component.isEmptyRender()).toBe(true);
    });
    it('should submit on click', () => {
        const expected = {
            data: {
                manualData: {
                    id: 'test-id',
                    issued: '2016/05/23',
                    title: 'Test Title',
                    type: 'article-journal',
                },
                people: [
                    { family: 'Doe', given: 'John', type: 'author' },
                    { family: 'Smith', given: 'Jane', type: 'author' },
                ],
            }
        };

        const { component, wm } = setup();
        const form = component.find('form');
        const setParams = wm.setParams as jest.Mock<{}>;
        const close = wm.close as jest.Mock<{}>;
        form.simulate('submit');

        expect(setParams).toHaveBeenCalledTimes(1);
        expect(setParams).toHaveBeenCalledWith(expected);
        expect(close).toHaveBeenCalledTimes(1);
    });
});
