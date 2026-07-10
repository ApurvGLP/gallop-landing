// Edge password gate for the Gallop preview.
// Everyone on the team uses the same username + password below.
// To change them, edit USER / PASS and redeploy.
export const config = { matcher: "/((?!favicon.ico).*)" };

const USER = "gallop";
const PASS = "GallopReliableVelocity";

export default function middleware(request) {
  const auth = request.headers.get("authorization");
  if (auth) {
    const [scheme, encoded] = auth.split(" ");
    if (scheme === "Basic" && encoded) {
      const decoded = atob(encoded);
      const i = decoded.indexOf(":");
      const u = decoded.slice(0, i);
      const p = decoded.slice(i + 1);
      if (u === USER && p === PASS) return; // authenticated — serve the page
    }
  }
  return new Response("Authentication required.", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="Gallop Preview", charset="UTF-8"' },
  });
}
