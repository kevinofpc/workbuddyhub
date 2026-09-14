import { createClient } from "@sanity/client";

const environment = process as NodeJS.Process & {
  loadEnvFile?: (path: string) => void;
};
environment.loadEnvFile?.(".env.local");

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const token = process.env.SANITY_API_TOKEN;

if (!projectId || !dataset || !token) {
  throw new Error("Missing Sanity environment configuration");
}

const client = createClient({
  apiVersion: "2024-08-01",
  dataset,
  projectId,
  token,
  useCdn: false,
});

async function main() {
  const audit = await client.fetch(`{
    "resourceCount": count(*[_type == "item" && _id match "workbuddy.resource.*" && forceHidden != true && defined(publishDate)]),
    "resourcesWithoutSource": *[_type == "item" && _id match "workbuddy.resource.*" && (!defined(link) || !defined(sourceName) || !defined(lastChecked))]._id,
    "resourcesWithoutImage": *[_type == "item" && _id match "workbuddy.resource.*" && !defined(image.asset)].name,
    "documentsWithRemovedPositioning": *[_id match "workbuddy.*" && (
      name match "*非官方*" || title match "*非官方*" || description match "*非官方*" || summary match "*非官方*" ||
      introduction match "*非官方*" || verificationNote match "*非官方*" || usageNotes match "*非官方*" || rightsNote match "*非官方*" ||
      name match "*unofficial*" || title match "*unofficial*" || description match "*unofficial*" || summary match "*unofficial*" ||
      introduction match "*unofficial*" || verificationNote match "*unofficial*" || usageNotes match "*unofficial*" || rightsNote match "*unofficial*"
    )]._id,
    "recipes": *[_type == "recipe" && _id match "workbuddy.recipe.*"] | order(_id asc) { _id, "slug": slug.current, "slugType": slug._type, status, "hasSource": defined(sourceUrl) },
    "guides": *[_type == "guide" && _id match "workbuddy.guide.*"] | order(_id asc) { _id, "slug": slug.current, "slugType": slug._type, status, "hasSource": defined(sourceUrl) },
    "cases": *[_type == "caseStudy" && _id match "workbuddy.case.*"] | order(_id asc) { _id, "slug": slug.current, title, sourceName, "hasVerification": defined(verificationNote) },
    "brandAssets": *[_type == "brandAsset" && _id match "workbuddy.brand-asset.*"] | order(_id asc) { _id, "slug": slug.current, title, assetType, status, sourceName, "hasImage": defined(image.asset), "hasUsageNotes": defined(usageNotes), "hasRightsNote": defined(rightsNote) }
  }`);

  console.log(JSON.stringify({ projectId, dataset, ...audit }, null, 2));
}

main().catch((error) => {
  console.error("WorkBuddy Hub audit failed:", error);
  process.exitCode = 1;
});
