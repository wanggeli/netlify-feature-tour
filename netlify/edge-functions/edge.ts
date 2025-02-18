import { Context } from "@netlify/edge-functions";

export default async (request: Request, context: Context) => {

    var url = request.url;
    var host = null;
    var pathname = url.split('/api/edge')[1]
    if (pathname != "") {
        host = pathname.split('/')[1];
        url = `https:/${pathname}`
    }
    var headers = {};
    request.headers.forEach((value, key) => {
        headers[key] = value;
    });
    if (host) {
        headers['host'] = host;
        var res = await fetch(url, {
            method: request.method,
            mode: request.mode,
            cache: request.cache,
            credentials: request.credentials,
            headers: headers,
            redirect: request.redirect,
            referrerPolicy: request.referrerPolicy,
            body: request.body
        });

        headers = {};
        res.headers.forEach((value, key) => {
            headers[key] = value;
        });
        return new Response(res.body, {
            status: res.status,
            statusText: res.statusText,
            headers: headers
        });
    }
    else {
        return new Response(`Hello, I'm now an Edge Function!`);
    }
};

export const config = { path: "/api/edge/*" };