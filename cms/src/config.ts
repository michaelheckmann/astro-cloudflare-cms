import { type Config, configSchema } from "./lib/schema";

const config: Config = {
  meta: {
    branch: "main",
    repo: "astro-cloudflare-cms",
    owner: "michaelheckmann",
  },
  content: [
    {
      name: "home",
      label: "Home",
      items: [
        {
          name: "home-page",
          label: "Home Page",
          type: "file",
          fileType: "json",
          path: "web/src/content/pages/home.json",
          fields: [
            {
              type: "string",
              name: "title",
              label: "Title",
              description: "The title of the page",
              default: "Home",
              required: true,
            },
            {
              type: "text",
              name: "body",
              label: "Body",
              description: "The body of the page",
              required: true,
            },
            {
              type: "number",
              name: "version",
              label: "Version",
              default: 1,
            },
            {
              type: "boolean",
              name: "status",
              label: "Status",
              switchLabel: "Enabled",
              default: true,
            },
            {
              type: "image",
              name: "image",
              label: "Image",
            },
            {
              type: "date",
              name: "created_at",
              label: "Created At",
              default: new Date(),
            },
            {
              type: "date",
              name: "published_at",
              label: "Published At",
              min: new Date("2024-01-01"),
              max: new Date("2024-12-31"),
            },
            {
              type: "select",
              name: "type",
              label: "Type",
              options: [
                {
                  label: "Option 1",
                  value: "option-1",
                },
                {
                  label: "Option 2",
                  value: "option-2",
                },
                {
                  label: "Option 3",
                  value: "option-3",
                },
              ],
            },
          ],
        },
      ],
    },
    {
      name: "blog",
      label: "Blog",
      items: [
        {
          name: "blog-page",
          label: "Blog Page",
          type: "file",
          fileType: "json",
          path: "web/src/content/pages/blog.json",
          fields: [
            {
              type: "string",
              name: "title",
              label: "Title",
              description: "The title of the page",
              required: true,
            },
            {
              type: "text",
              name: "body",
              label: "Body",
              description: "The body of the page",
              required: true,
            },
            {
              type: "number",
              name: "version",
              label: "Version",
              default: 1,
            },
            {
              type: "boolean",
              name: "status",
              label: "Status",
              switchLabel: "Enabled",
              default: true,
            },
            {
              type: "image",
              name: "image",
              label: "Image",
            },
            {
              type: "date",
              name: "created_at",
              label: "Created At",
              default: new Date(),
            },
            {
              type: "date",
              name: "published_at",
              label: "Published At",
              min: new Date("2024-01-01"),
              max: new Date("2024-12-31"),
            },
            {
              type: "select",
              name: "type",
              label: "Type",
              options: [
                {
                  label: "Option 1",
                  value: "option-1",
                },
                {
                  label: "Option 2",
                  value: "option-2",
                },
                {
                  label: "Option 3",
                  value: "option-3",
                },
              ],
            },
          ],
        },
        {
          name: "blog-articles",
          label: "Blog Articles",
          type: "collection",
          fileType: "md",
          path: "web/src/content/blog/article.md",
          bodyKey: "body",
          displayKey: "title",
          fields: [
            {
              type: "string",
              name: "title",
              label: "Title",
              description: "The title of the article",
              required: true,
            },
            {
              type: "string",
              name: "description",
              label: "Description",
              description: "The description of the article",
              required: true,
            },
            {
              type: "text",
              name: "body",
              label: "Body",
              description: "The body of the article",
              required: true,
            },
            {
              type: "date",
              name: "pubDate",
              label: "Published At",
              min: new Date("2024-01-01"),
              max: new Date("2024-12-31"),
              required: true,
            },
            {
              type: "date",
              name: "updatedDate",
              label: "Published At",
              min: new Date("2024-01-01"),
              max: new Date("2024-12-31"),
            },
            {
              type: "image",
              name: "heroImage",
              label: "Hero Image",
            },
          ],
        },
      ],
    },
  ],
};

export const CONFIG = configSchema.parse(config);
