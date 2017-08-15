declare module 'merge-stream' {
    function merge(...streams: NodeJS.ReadWriteStream[]): NodeJS.ReadWriteStream;
    namespace merge {

    }
    export = merge;
}
