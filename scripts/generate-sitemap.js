import { SitemapStream, streamToPromise } from "sitemap";
import { createWriteStream } from "fs";
import fs from "fs-extra";

const BASE_URL = "https://www.kayahaus.co.za";

const routes = [
  "/",
  "/products",
  "/about",
  "/services",
  "/contact",
];

async function generateSitemap() {
  await fs.ensureDir("public");

  const sitemap = new SitemapStream({ hostname: BASE_URL });
  const writeStream = createWriteStream("public/sitemap.xml");

  sitemap.pipe(writeStream);

  routes.forEach((route) => {
    sitemap.write({
      url: route,
      changefreq: "weekly",
      priority: route === "/" ? 1.0 : 0.8,
    });
  });

  sitemap.end();

  await streamToPromise(sitemap);
  console.log("✅ Sitemap generated: public/sitemap.xml");
}

generateSitemap();
