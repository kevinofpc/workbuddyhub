import { defineArrayMember, defineField, defineType } from "sanity";

const difficulty = defineField({
  name: "difficulty",
  title: "Difficulty",
  type: "string",
  options: {
    list: [
      { title: "Beginner", value: "beginner" },
      { title: "Intermediate", value: "intermediate" },
      { title: "Advanced", value: "advanced" },
    ],
  },
});

const status = defineField({
  name: "status",
  title: "Status",
  type: "string",
  initialValue: "draft",
  options: {
    list: [
      { title: "Draft", value: "draft" },
      { title: "In review", value: "review" },
      { title: "Published", value: "published" },
      { title: "Archived", value: "archived" },
    ],
  },
});

const provenance = [
  defineField({
    name: "contentOrigin",
    title: "Content origin",
    type: "string",
    initialValue: "editorial",
    options: {
      list: [
        { title: "Hub original", value: "original" },
        { title: "Imported and adapted", value: "imported" },
        { title: "Community submission", value: "community" },
        { title: "Editorial synthesis", value: "editorial" },
      ],
    },
  }),
  defineField({
    name: "verificationStatus",
    title: "Verification status",
    type: "string",
    initialValue: "edited",
    options: {
      list: [
        { title: "Imported", value: "imported" },
        { title: "Hub edited", value: "edited" },
        { title: "Hub verified", value: "verified" },
        { title: "Community verified", value: "community_verified" },
        { title: "Outdated", value: "outdated" },
      ],
    },
  }),
  defineField({
    name: "verifiedAt",
    title: "Practice verified at",
    description: "Only set this after the workflow was actually reproduced.",
    type: "datetime",
  }),
  defineField({
    name: "sourceUrl",
    title: "Primary source URL",
    type: "url",
    validation: (rule) =>
      rule
        .uri({ scheme: ["http", "https"] })
        .warning("Use a public source URL"),
  }),
  defineField({
    name: "sourceName",
    title: "Source name",
    type: "string",
  }),
  defineField({
    name: "sourceLicense",
    title: "Source license",
    type: "string",
  }),
  defineField({
    name: "sourceRepository",
    title: "Source repository",
    type: "url",
  }),
  defineField({
    name: "sourcePath",
    title: "Source path",
    type: "string",
  }),
  defineField({
    name: "sourceKind",
    title: "Source kind",
    type: "string",
    options: {
      list: [
        { title: "Official", value: "official" },
        { title: "Community", value: "community" },
        { title: "Editorial synthesis", value: "editorial" },
      ],
      layout: "radio",
    },
  }),
  defineField({
    name: "sourceCheckedAt",
    title: "Source checked at",
    type: "datetime",
  }),
  defineField({
    name: "verificationNote",
    title: "Verification note",
    description: "State evidence limits and anything readers should verify.",
    type: "text",
    rows: 3,
  }),
  defineField({
    name: "coverImage",
    title: "Source screenshot / cover",
    type: "image",
    options: { hotspot: true },
    fields: [
      defineField({
        name: "alt",
        title: "Alternative text",
        type: "string",
      }),
      defineField({
        name: "sourceUrl",
        title: "Screenshot source URL",
        type: "url",
      }),
    ],
  }),
];

const titleAndSlug = [
  defineField({
    name: "title",
    title: "Title",
    type: "string",
    validation: (rule) => rule.required(),
  }),
  defineField({
    name: "slug",
    title: "Slug",
    type: "slug",
    options: { source: "title", maxLength: 96 },
    validation: (rule) => rule.required(),
  }),
  defineField({
    name: "description",
    title: "Description",
    type: "text",
    rows: 3,
    validation: (rule) => rule.required(),
  }),
];

const taxonomy = [
  difficulty,
  defineField({
    name: "icon",
    title: "Icon key",
    type: "string",
    description: "WorkBuddy Hub icon name used by the website",
  }),
  defineField({
    name: "category",
    title: "Display category",
    type: "string",
  }),
  defineField({
    name: "features",
    title: "WorkBuddy Features",
    type: "array",
    of: [defineArrayMember({ type: "reference", to: [{ type: "feature" }] })],
  }),
  defineField({
    name: "tags",
    title: "Tags",
    type: "array",
    of: [defineArrayMember({ type: "reference", to: [{ type: "tag" }] })],
  }),
  status,
  defineField({
    name: "featured",
    title: "Featured",
    type: "boolean",
    initialValue: false,
  }),
  defineField({
    name: "score",
    title: "Editorial score",
    type: "number",
    validation: (rule) => rule.min(0).max(100),
  }),
  defineField({
    name: "updatedAt",
    title: "Content updated at",
    type: "datetime",
  }),
  ...provenance,
];

export const feature = defineType({
  name: "feature",
  title: "WorkBuddy Feature",
  type: "document",
  fields: [
    ...titleAndSlug,
    defineField({ name: "icon", title: "Icon key", type: "string" }),
    defineField({ name: "whatItIs", title: "What it is", type: "markdown" }),
    defineField({ name: "whenToUse", title: "When to use", type: "markdown" }),
    defineField({
      name: "whenNotToUse",
      title: "When not to use",
      type: "markdown",
    }),
    defineField({
      name: "commonMistakes",
      title: "Common mistakes",
      type: "markdown",
    }),
  ],
});

export const recipe = defineType({
  name: "recipe",
  title: "Recipe",
  type: "document",
  fields: [
    ...titleAndSlug,
    defineField({ name: "goal", title: "Goal", type: "text", rows: 2 }),
    defineField({
      name: "setupTime",
      title: "Setup time (minutes)",
      type: "number",
    }),
    defineField({
      name: "audience",
      title: "Suitable for",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "inputs",
      title: "Inputs",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "outputs",
      title: "Outputs",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({ name: "steps", title: "Complete steps", type: "markdown" }),
    defineField({ name: "prompt", title: "Prompt", type: "markdown" }),
    defineField({ name: "notes", title: "Notes", type: "markdown" }),
    defineField({
      name: "exampleResult",
      title: "Example result",
      type: "markdown",
    }),
    defineField({
      name: "acceptance",
      title: "Acceptance checklist",
      type: "markdown",
    }),
    defineField({
      name: "deliverables",
      title: "Deliverables",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({ name: "safety", title: "Safety notes", type: "markdown" }),
    ...taxonomy,
  ],
});

export const guide = defineType({
  name: "guide",
  title: "Guide",
  type: "document",
  fields: [
    ...titleAndSlug,
    defineField({
      name: "readingTime",
      title: "Reading time (minutes)",
      type: "number",
    }),
    defineField({ name: "content", title: "Guide content", type: "markdown" }),
    defineField({
      name: "faq",
      title: "FAQ",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "question", type: "string" },
            { name: "answer", type: "text" },
          ],
        },
      ],
    }),
    ...taxonomy,
  ],
});

export const caseStudy = defineType({
  name: "caseStudy",
  title: "Case Study",
  type: "document",
  fields: [
    ...titleAndSlug,
    defineField({
      name: "caseType",
      title: "Case type",
      type: "string",
      initialValue: "story",
      validation: (rule) => rule.required(),
      options: {
        list: [
          { title: "Real-world reproducible", value: "real" },
          { title: "Hands-on tutorial", value: "tutorial" },
          { title: "Public application story", value: "story" },
        ],
        layout: "radio",
      },
    }),
    defineField({
      name: "dataNature",
      title: "Data nature",
      type: "string",
      initialValue: "not-applicable",
      options: {
        list: [
          { title: "Real data", value: "real" },
          { title: "Anonymized real data", value: "anonymized" },
          { title: "Synthetic / teaching data", value: "synthetic" },
          { title: "Not applicable", value: "not-applicable" },
        ],
      },
    }),
    defineField({
      name: "estimatedTime",
      title: "Estimated practice time (minutes)",
      type: "number",
      validation: (rule) => rule.positive(),
    }),
    defineField({
      name: "priority",
      title: "Case display priority",
      description: "Higher numbers appear first in the case library.",
      type: "number",
      initialValue: 0,
    }),
    defineField({
      name: "userBackground",
      title: "User background",
      type: "markdown",
    }),
    defineField({
      name: "previousWorkflow",
      title: "Previous workflow",
      type: "markdown",
    }),
    defineField({ name: "painPoints", title: "Pain points", type: "markdown" }),
    defineField({
      name: "solution",
      title: "WorkBuddy solution",
      type: "markdown",
    }),
    defineField({
      name: "process",
      title: "Complete process",
      type: "markdown",
    }),
    defineField({ name: "keyPrompt", title: "Key prompt", type: "markdown" }),
    defineField({
      name: "result",
      title: "Result and metrics",
      type: "markdown",
    }),
    defineField({
      name: "improvements",
      title: "What could be improved",
      type: "markdown",
    }),
    defineField({
      name: "prerequisites",
      title: "Prerequisites",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "acceptance",
      title: "Acceptance checklist",
      type: "markdown",
    }),
    defineField({
      name: "deliverables",
      title: "Deliverables",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({ name: "safety", title: "Safety notes", type: "markdown" }),
    defineField({
      name: "limitations",
      title: "Known limitations",
      type: "markdown",
    }),
    defineField({
      name: "relatedRecipes",
      title: "Related recipes",
      type: "array",
      of: [{ type: "reference", to: [{ type: "recipe" }] }],
    }),
    defineField({
      name: "relatedGuides",
      title: "Related guides",
      type: "array",
      of: [{ type: "reference", to: [{ type: "guide" }] }],
    }),
    defineField({
      name: "relatedUseCases",
      title: "Related use cases",
      type: "array",
      of: [{ type: "reference", to: [{ type: "useCase" }] }],
    }),
    ...taxonomy,
  ],
});

export const useCase = defineType({
  name: "useCase",
  title: "Use Case",
  type: "document",
  fields: [
    ...titleAndSlug,
    defineField({
      name: "quickStart",
      title: "Simplest method",
      type: "markdown",
    }),
    defineField({
      name: "prompts",
      title: "Prompt examples",
      type: "array",
      of: [{ type: "text" }],
    }),
    defineField({
      name: "advanced",
      title: "Advanced methods",
      type: "markdown",
    }),
    defineField({
      name: "recipes",
      title: "Recommended recipes",
      type: "array",
      of: [{ type: "reference", to: [{ type: "recipe" }] }],
    }),
    defineField({
      name: "guides",
      title: "Recommended guides",
      type: "array",
      of: [{ type: "reference", to: [{ type: "guide" }] }],
    }),
    defineField({
      name: "cases",
      title: "Related cases",
      type: "array",
      of: [{ type: "reference", to: [{ type: "caseStudy" }] }],
    }),
    ...taxonomy,
  ],
});

export const learningPath = defineType({
  name: "learningPath",
  title: "Learning Path",
  type: "document",
  fields: [
    ...titleAndSlug,
    difficulty,
    defineField({
      name: "estimatedTime",
      title: "Estimated time (minutes)",
      type: "number",
    }),
    defineField({
      name: "outcomes",
      title: "Learning outcomes",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "lessons",
      title: "Lessons",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "title", type: "string" },
            { name: "description", type: "text" },
            { name: "duration", type: "number" },
            { name: "content", type: "markdown" },
          ],
        },
      ],
    }),
    status,
  ],
});

export const brandAsset = defineType({
  name: "brandAsset",
  title: "Brand Asset",
  type: "document",
  fields: [
    ...titleAndSlug,
    defineField({
      name: "assetType",
      title: "Asset type",
      type: "string",
      validation: (rule) => rule.required(),
      options: {
        list: [
          { title: "Logo / mark", value: "logo" },
          { title: "Social sharing image", value: "social" },
          { title: "Official brand reference", value: "reference" },
        ],
      },
    }),
    defineField({
      name: "image",
      title: "Brand image",
      type: "image",
      validation: (rule) => rule.required(),
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Alternative text",
          type: "string",
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: "sourceUrl",
          title: "Image source URL",
          type: "url",
        }),
      ],
    }),
    defineField({
      name: "sourceUrl",
      title: "Primary source URL",
      type: "url",
      validation: (rule) =>
        rule
          .uri({ scheme: ["http", "https"] })
          .warning("Use a public source URL"),
    }),
    defineField({ name: "sourceName", title: "Source name", type: "string" }),
    defineField({
      name: "sourceKind",
      title: "Source kind",
      type: "string",
      options: {
        list: [
          { title: "Official", value: "official" },
          { title: "Editorial / owned", value: "editorial" },
        ],
        layout: "radio",
      },
    }),
    defineField({
      name: "usageNotes",
      title: "Usage notes",
      description:
        "Where this asset may be used and how it should be presented.",
      type: "text",
      rows: 3,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "rightsNote",
      title: "Rights / affiliation note",
      description: "Record ownership, trademark and affiliation limits.",
      type: "text",
      rows: 3,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "sourceCheckedAt",
      title: "Source checked at",
      type: "datetime",
    }),
    status,
    defineField({
      name: "featured",
      title: "Featured",
      type: "boolean",
      initialValue: false,
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "assetType", media: "image" },
  },
});

export const hubContentTypes = [
  feature,
  recipe,
  guide,
  caseStudy,
  useCase,
  learningPath,
  brandAsset,
];
