/// <reference path="../../../../../lib/types/CSL.d.ts" />
import { shallow } from 'enzyme';
import toJSON from 'enzyme-to-json';
import * as React from 'react';
import EditDialog from '../';

const defaultData = {
    id: '12345',
    title: 'Test Title',
    type: 'article-journal',
};

const setup = (data = defaultData as CSL.Data) => {
    const onSubmit = jest.fn();
    const component = shallow(<EditDialog data={data} onSubmit={onSubmit} />);
    return {
        component,
        instance: component.instance() as EditDialog,
        onSubmit,
    };
};

describe('<EditDialog />', () => {
    it('should match snapshot', () => {
        const { component } = setup();
        expect(toJSON(component)).toMatchSnapshot();
    });
    it('should handle submit', () => {
        const data: CSL.Data = {
            author: [
                {
                    given: 'John',
                    family: 'Doe',
                },
            ],
        };
        const { component, onSubmit } = setup(data);
        const preventDefault = jest.fn();
        component.simulate('submit', { preventDefault });
        expect(onSubmit).toHaveBeenCalledTimes(1);
        expect(preventDefault).toHaveBeenCalledTimes(1);
    });
    describe('test various types of CSL data passed as a prop', () => {
        it('should handle primitive properties', () => {
            const data: CSL.Data = {
                title: 'Hello world',
            };
            const { instance } = setup(data);
            expect([...instance.fields.entries()]).toEqual([['title', 'Hello world']]);
            expect([...instance.people]).toEqual([]);
        });
        it('should handle dates', () => {
            const data: CSL.Data = {
                issued: {
                    'date-parts': [['2003', '01', '02']],
                },
            };
            const { instance } = setup(data);
            expect([...instance.fields.entries()]).toEqual([['issued', '2003/01/02']]);
            expect([...instance.people]).toEqual([]);
        });
        it('should handle person data', () => {
            const data: CSL.Data = {
                author: [
                    {
                        given: 'John',
                        family: 'Doe',
                    },
                ],
            };
            const { instance } = setup(data);
            expect([...instance.fields.entries()]).toEqual([]);
            expect([...instance.people]).toEqual([
                { family: 'Doe', given: 'John', type: 'author' },
            ]);
        });
        it('should handle unsupported properties', () => {
            const data: CSL.Data = {
                foo: {
                    bar: 'baz',
                },
            };
            const { instance } = setup(data);
            expect([...instance.fields.entries()]).toEqual([]);
            expect([...instance.people]).toEqual([]);
        });
    });
});
