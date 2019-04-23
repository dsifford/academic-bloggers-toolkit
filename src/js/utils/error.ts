type ResponseData = Pick<Response, Exclude<keyof Response, keyof Body>>;

export class ResponseError extends Error {
    resource: string;
    status: number;
    statusText: string;
    url: string;
    constructor(resource: string, { status, statusText, url }: ResponseData) {
        super(resource);
        this.resource = resource;
        this.status = status;
        this.statusText = statusText;
        this.url = url;
    }
}
