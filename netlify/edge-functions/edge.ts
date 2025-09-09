export default async (req: Request): Promise<Response> => {
    const url = new URL(req.url);

    // Check if the request path starts with our proxy prefix
    if (url.pathname.startsWith("/api/edge/")) {
        const targetUrl = url.pathname.substring("/api/edge/".length);

        // If no target URL is provided, return an error
        if (!targetUrl) {
            return new Response("Hello, I'm an Edge Function from netlify.app.", { status: 200 });
        }

        try {
            // Construct the URL for the proxied request
            const proxyTarget = new URL(targetUrl);

            // Re-create the request to pass along all original headers and body
            const proxyRequest = new Request(proxyTarget, {
                method: req.method,
                headers: req.headers,
                body: req.body,
                redirect: 'follow',
            });

            // Fetch the response from the target URL
            const response = await fetch(proxyRequest);

            // Return the proxied response
            return response;
        } catch (error) {
            // Handle potential errors like invalid URLs or network issues
            return new Response(`Proxy error: ${error.message}`, { status: 500 });
        }
    }

    // Handle all other requests that don't match the proxy path
    return new Response("Hello, I'm an Edge Function from netlify.app.", { status: 200 });
};

export const config = { path: "/api/edge/*" };