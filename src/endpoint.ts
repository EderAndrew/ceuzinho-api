<<<<<<< HEAD
import ngrok from "@ngrok/ngrok"

(async function() {
    const listener = await ngrok.forward({
        // The port your app is running on.
        addr: 4001,
        authtoken: process.env.NGROK_AUTHTOKEN,
        domain: process.env.NGROK_RESERVED_DOMAIN,
        // Secure your endpoint with a traffic policy.
        // This could also be a path to a traffic policy file.
        //traffic_policy: '{"on_http_request": [{"actions": [{"type": "oauth","config": {"provider": "google"}}]}]}'
    });

    // Output ngrok url to console
    console.log(`Ingress established at ${listener.url()}`);
})();

// Keep the process alive
=======
import ngrok from "@ngrok/ngrok"

(async function() {
    const listener = await ngrok.forward({
        // The port your app is running on.
        addr: 4001,
        authtoken: process.env.NGROK_AUTHTOKEN,
        domain: process.env.NGROK_RESERVED_DOMAIN,
        // Secure your endpoint with a traffic policy.
        // This could also be a path to a traffic policy file.
        //traffic_policy: '{"on_http_request": [{"actions": [{"type": "oauth","config": {"provider": "google"}}]}]}'
    });

    // Output ngrok url to console
    console.log(`Ingress established at ${listener.url()}`);
})();

// Keep the process alive
>>>>>>> 36f79eb90839a95e038375eeddfeceafd682b179
process.stdin.resume();