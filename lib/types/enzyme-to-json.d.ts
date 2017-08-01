declare module 'enzyme-to-json' {
    import { ReactWrapper, ShallowWrapper } from 'enzyme';
    function toJSON(component: ReactWrapper<any, any> | ShallowWrapper<any, any>): object;
    export default toJSON;
}
