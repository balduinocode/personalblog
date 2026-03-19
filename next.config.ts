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
      destination: '/notas/:slug',
      permanent: false,
    },
    {
      source: '/thoughts',
      destination: '/notas',
      permanent: true,
    },
    {
      source: '/thoughts/:slug',
      destination: '/notas/:slug',
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
      source: '/notas',
      destination: '/thoughts',
    },
    {
      source: '/notas/:slug',
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
