import type { MetadataRoute } from "next";
import { SITE_URL } from "../lib/site";
import { DESTINATION_SLUGS } from "../lib/destinations";

function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "/",
    ...DESTINATION_SLUGS.map((slug) => `/${slug}`),
    "/mentions-legales",
    "/cgv",
    "/politique-de-confidentialite",
  ];
  return routes.map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: new Date(),
  }));
}

export { sitemap };
export default sitemap;
