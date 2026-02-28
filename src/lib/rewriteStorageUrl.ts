/**
 * Rewrites internal Convex storage URLs (Traefik HTTP) to the public HTTPS backend URL.
 *
 * The self-hosted Convex backend generates storage URLs using its internal Docker/Traefik
 * hostname, which is HTTP-only. Since the site is served over HTTPS, browsers block
 * these mixed-content requests. This utility ensures all storage URLs use the public
 * reverse-proxy origin.
 *
 * This is the client-side counterpart of convex/storageUrlUtils.ts.
 * Both are needed until `npx convex deploy` can successfully push the server-side fix.
 */

const INTERNAL_ORIGIN =
    "http://serum-scupt-app-convex-816d56-76-13-44-208.traefik.me";
const PUBLIC_ORIGIN = "https://sands.backend.serumandsculpt.co.za";

export function rewriteStorageUrl(url: string): string {
    return url.replace(INTERNAL_ORIGIN, PUBLIC_ORIGIN);
}
