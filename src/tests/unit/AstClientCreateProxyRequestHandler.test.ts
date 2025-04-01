import { AstClient } from "../../main/client/AstClient";

describe("AstClient - createProxyRequestHandler", () => {
    const OLD_ENV = process.env;

    beforeEach(() => {
        jest.resetModules();
        process.env = { ...OLD_ENV };
    });

    afterAll(() => {
        process.env = OLD_ENV;
    });

    it("should return proxy with default port 80 when HTTP_PROXY is http without port", () => {
        process.env.HTTP_PROXY = "http://31.220.15.234:80";

        const client = new AstClient();
        const handler = (client as any).createProxyRequestHandler();

        expect(handler).toBeDefined();
    });

    it("should return proxy with default port 443 when HTTP_PROXY is https without port", () => {
        process.env.HTTP_PROXY = "https://31.220.15.234:443";

        const client = new AstClient();
        const handler = (client as any).createProxyRequestHandler();

        expect(handler).toBeDefined();
    });

    it("should return undefined when HTTP_PROXY is empty", () => {
        delete process.env.HTTP_PROXY;

        const client = new AstClient();
        const handler = (client as any).createProxyRequestHandler();

        expect(handler).toBeUndefined();
    });

    it("should return undefined when HTTP_PROXY is invalid protocol", () => {
        process.env.HTTP_PROXY = "ftp://31.220.15.234";

        const client = new AstClient();
        const handler = (client as any).createProxyRequestHandler();

        expect(handler).toBeUndefined();
    });

    it("should use default port 80 when HTTP_PROXY is http without port", () => {
        process.env.HTTP_PROXY = "http://31.220.15.234"; 

        const client = new AstClient();
        const handler = (client as any).createProxyRequestHandler();

        expect(handler).toBeDefined();
    });

    it("should use default port 443 when HTTP_PROXY is https without port", () => {
        process.env.HTTP_PROXY = "https://31.220.15.234"; 

        const client = new AstClient();
        const handler = (client as any).createProxyRequestHandler();

        expect(handler).toBeDefined();
    });
});