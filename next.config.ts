import withMDX from '@next/mdx'
import { NextConfig } from 'next'
import path from 'node:path'

export default withMDX()({
  pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],
  turbopack: {
    root: path.resolve(__dirname),
  },
  redirects: async () => [
    {
      source: '/posts/:slug',
      destination: '/escritos/:slug',
      permanent: false,
    },
    {
      source: '/thoughts',
      destination: '/escritos',
      permanent: true,
    },
    {
      source: '/thoughts/:slug',
      destination: '/escritos/:slug',
      permanent: true,
    },
    {
      source: '/notas',
      destination: '/escritos',
      permanent: true,
    },
    {
      source: '/notas/:slug',
      destination: '/escritos/:slug',
      permanent: true,
    },
    {
      source: '/projects',
      destination: '/projetos',
      permanent: true,
    },
  ],
  rewrites: async () => [
    {
      source: '/escritos',
      destination: '/thoughts',
    },
    {
      source: '/escritos/:slug',
      destination: '/thoughts/:slug',
    },
    {
      source: '/projetos',
      destination: '/projects',
    },
  ],
  experimental: {
    mdxRs: {
      mdxType: 'gfm',
    },
    turbopackFileSystemCacheForDev: true,
    turbopackFileSystemCacheForBuild: true,
  },
  transpilePackages: ['shiki'],
  serverExternalPackages: ['@shikijs/twoslash'],
  images: {
    contentDispositionType: 'inline',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
} satisfies NextConfig)
