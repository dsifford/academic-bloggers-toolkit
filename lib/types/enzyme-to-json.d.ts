declare module 'enzyme-to-json' {
    interface ConfigOptions {
        mode?: 'shallow' | 'deep';
        noKey?: boolean;
    }
    import { ReactWrapper, ShallowWrapper } from 'enzyme';
    function toJSON(
        component: ReactWrapper<any, any> | ShallowWrapper<any, any>,
        options?: ConfigOptions,
    ): object;
    export default toJSON;
}
