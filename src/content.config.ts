import { defineCollection, z } from 'astro:content';
import { glob, file } from 'astro/loaders';

export const NEWS_TAGS = ['Talks', 'Projects', 'Policy', 'Media', 'Research', 'Yale', 'CSIS'] as const;

const news = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/news' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      date: z.coerce.date(),
      tags: z.array(z.string()).default([]),
      source_url: z.string().url().optional(),
      image: image().optional(),
      // 'contain' for posters, flyers and wide banners whose text would be lost to a crop.
      image_fit: z.enum(['cover', 'contain']).default('cover'),
      excerpt: z.string().optional(),
    }),
});

const publications = defineCollection({
  loader: file('src/data/publications.yaml'),
  schema: z.object({
    title: z.string(),
    type: z.enum(['journal_article', 'book_chapter', 'book', 'book_review', 'policy_piece', 'op_ed', 'working_paper']),
    status: z.enum(['published', 'forthcoming', 'in_press']),
    year: z.number(),
    venue: z.string(),
    venue_short: z.string().nullable().optional(),
    volume: z.union([z.string(), z.number()]).nullable().optional(),
    issue: z.union([z.string(), z.number()]).nullable().optional(),
    pages: z.string().nullable().optional(),
    doi: z.string().nullable().optional(),
    url: z.string().nullable().optional(),
    author_order: z.string().nullable().optional(),
    coauthors: z.array(z.string()).default([]),
    editors: z.union([z.string(), z.array(z.string())]).nullable().optional(),
    publisher: z.string().nullable().optional(),
    abstract: z.string().nullable().optional(),
    keywords: z.array(z.string()).default([]),
    award: z.string().nullable().optional(),
  }),
});

const coverage = defineCollection({
  loader: file('src/data/coverage.yaml'),
  schema: z.object({
    items: z.array(z.object({ outlet: z.string(), url: z.string() })).default([]),
    award: z.object({ name: z.string(), url: z.string().optional() }).optional(),
    pdf: z.string().optional(),
    url: z.string().optional(),
    // Site-only extra: CV display order (1 = first).
    order: z.number().optional(),
  }),
});

const policy = defineCollection({
  loader: file('src/data/policy.yaml'),
  schema: z.object({
    title: z.string(),
    url: z.string(),
    section: z.enum(['op_ed', 'comparative_connections', 'other']),
    year: z.number(),
    detail: z.string(),
    coauthors: z.array(z.string()).default([]),
    extra_links: z.array(z.object({ label: z.string(), url: z.string() })).default([]),
  }),
});

const teaching = defineCollection({
  loader: file('src/data/teaching.yaml'),
  schema: z.object({
    order: z.number(),
    institution: z.string(),
    course: z.string(),
    number: z.string().optional(),
    level: z.string(),
    years: z.string(),
    term: z.string().optional(),
    planned: z.boolean().default(false),
    syllabus: z.string().optional(),
    description: z.string().optional(),
  }),
});

// McClean Zemi members. Photos live in src/assets/lab/<id>.jpg; empty strings mean "not yet".
const lab = defineCollection({
  loader: file('src/data/lab.yaml'),
  schema: z.object({
    order: z.number(),
    name: z.string(),
    name_ja: z.string().default(''),
    year: z.string().default(''),
    college: z.string().default(''),
    photo: z.string().default(''),
  }),
});

const wip = defineCollection({
  loader: file('src/data/wip.yaml'),
  schema: z.object({
    title: z.string(),
    coauthors: z.array(z.string()).default([]),
  }),
});

export const collections = { news, publications, coverage, policy, teaching, wip, lab };
