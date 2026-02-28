/**
 * Rewrites internal Convex storage URLs (Traefik HTTP) to the public HTTPS backend URL.
 *
 * The self-hosted Convex backend generates URLs using its internal Docker/Traefik
 * hostname, which is HTTP-only and inaccessible from browsers on the HTTPS site.
 * This utility ensures all storage URLs use the public reverse-proxy origin.
 */

const INTERNAL_ORIGIN =
    "http://serum-scupt-app-convex-816d56-76-13-44-208.traefik.me";
const PUBLIC_ORIGIN = "https://sands.backend.serumandsculpt.co.za";

export function rewriteStorageUrl(url: string): string {
    return url.replace(INTERNAL_ORIGIN, PUBLIC_ORIGIN);
}
