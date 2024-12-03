/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file was automatically generated by TanStack Router.
// You should NOT make any changes in this file as it will be overwritten.
// Additionally, you should also exclude this file from your linter and/or formatter to prevent it from being checked or modified.

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as IndexImport } from './routes/index'
import { Route as FileGroupIndexImport } from './routes/file/$group/index'
import { Route as CollectionGroupIndexImport } from './routes/collection/$group/index'
import { Route as FileGroupNameImport } from './routes/file/$group/$name'
import { Route as CollectionGroupNameIndexImport } from './routes/collection/$group/$name/index'
import { Route as CollectionGroupNameEntryImport } from './routes/collection/$group/$name/$entry'

// Create/Update Routes

const IndexRoute = IndexImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => rootRoute,
} as any)

const FileGroupIndexRoute = FileGroupIndexImport.update({
  id: '/file/$group/',
  path: '/file/$group/',
  getParentRoute: () => rootRoute,
} as any)

const CollectionGroupIndexRoute = CollectionGroupIndexImport.update({
  id: '/collection/$group/',
  path: '/collection/$group/',
  getParentRoute: () => rootRoute,
} as any)

const FileGroupNameRoute = FileGroupNameImport.update({
  id: '/file/$group/$name',
  path: '/file/$group/$name',
  getParentRoute: () => rootRoute,
} as any)

const CollectionGroupNameIndexRoute = CollectionGroupNameIndexImport.update({
  id: '/collection/$group/$name/',
  path: '/collection/$group/$name/',
  getParentRoute: () => rootRoute,
} as any)

const CollectionGroupNameEntryRoute = CollectionGroupNameEntryImport.update({
  id: '/collection/$group/$name/$entry',
  path: '/collection/$group/$name/$entry',
  getParentRoute: () => rootRoute,
} as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      id: '/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof IndexImport
      parentRoute: typeof rootRoute
    }
    '/file/$group/$name': {
      id: '/file/$group/$name'
      path: '/file/$group/$name'
      fullPath: '/file/$group/$name'
      preLoaderRoute: typeof FileGroupNameImport
      parentRoute: typeof rootRoute
    }
    '/collection/$group/': {
      id: '/collection/$group/'
      path: '/collection/$group'
      fullPath: '/collection/$group'
      preLoaderRoute: typeof CollectionGroupIndexImport
      parentRoute: typeof rootRoute
    }
    '/file/$group/': {
      id: '/file/$group/'
      path: '/file/$group'
      fullPath: '/file/$group'
      preLoaderRoute: typeof FileGroupIndexImport
      parentRoute: typeof rootRoute
    }
    '/collection/$group/$name/$entry': {
      id: '/collection/$group/$name/$entry'
      path: '/collection/$group/$name/$entry'
      fullPath: '/collection/$group/$name/$entry'
      preLoaderRoute: typeof CollectionGroupNameEntryImport
      parentRoute: typeof rootRoute
    }
    '/collection/$group/$name/': {
      id: '/collection/$group/$name/'
      path: '/collection/$group/$name'
      fullPath: '/collection/$group/$name'
      preLoaderRoute: typeof CollectionGroupNameIndexImport
      parentRoute: typeof rootRoute
    }
  }
}

// Create and export the route tree

export interface FileRoutesByFullPath {
  '/': typeof IndexRoute
  '/file/$group/$name': typeof FileGroupNameRoute
  '/collection/$group': typeof CollectionGroupIndexRoute
  '/file/$group': typeof FileGroupIndexRoute
  '/collection/$group/$name/$entry': typeof CollectionGroupNameEntryRoute
  '/collection/$group/$name': typeof CollectionGroupNameIndexRoute
}

export interface FileRoutesByTo {
  '/': typeof IndexRoute
  '/file/$group/$name': typeof FileGroupNameRoute
  '/collection/$group': typeof CollectionGroupIndexRoute
  '/file/$group': typeof FileGroupIndexRoute
  '/collection/$group/$name/$entry': typeof CollectionGroupNameEntryRoute
  '/collection/$group/$name': typeof CollectionGroupNameIndexRoute
}

export interface FileRoutesById {
  __root__: typeof rootRoute
  '/': typeof IndexRoute
  '/file/$group/$name': typeof FileGroupNameRoute
  '/collection/$group/': typeof CollectionGroupIndexRoute
  '/file/$group/': typeof FileGroupIndexRoute
  '/collection/$group/$name/$entry': typeof CollectionGroupNameEntryRoute
  '/collection/$group/$name/': typeof CollectionGroupNameIndexRoute
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths:
    | '/'
    | '/file/$group/$name'
    | '/collection/$group'
    | '/file/$group'
    | '/collection/$group/$name/$entry'
    | '/collection/$group/$name'
  fileRoutesByTo: FileRoutesByTo
  to:
    | '/'
    | '/file/$group/$name'
    | '/collection/$group'
    | '/file/$group'
    | '/collection/$group/$name/$entry'
    | '/collection/$group/$name'
  id:
    | '__root__'
    | '/'
    | '/file/$group/$name'
    | '/collection/$group/'
    | '/file/$group/'
    | '/collection/$group/$name/$entry'
    | '/collection/$group/$name/'
  fileRoutesById: FileRoutesById
}

export interface RootRouteChildren {
  IndexRoute: typeof IndexRoute
  FileGroupNameRoute: typeof FileGroupNameRoute
  CollectionGroupIndexRoute: typeof CollectionGroupIndexRoute
  FileGroupIndexRoute: typeof FileGroupIndexRoute
  CollectionGroupNameEntryRoute: typeof CollectionGroupNameEntryRoute
  CollectionGroupNameIndexRoute: typeof CollectionGroupNameIndexRoute
}

const rootRouteChildren: RootRouteChildren = {
  IndexRoute: IndexRoute,
  FileGroupNameRoute: FileGroupNameRoute,
  CollectionGroupIndexRoute: CollectionGroupIndexRoute,
  FileGroupIndexRoute: FileGroupIndexRoute,
  CollectionGroupNameEntryRoute: CollectionGroupNameEntryRoute,
  CollectionGroupNameIndexRoute: CollectionGroupNameIndexRoute,
}

export const routeTree = rootRoute
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/",
        "/file/$group/$name",
        "/collection/$group/",
        "/file/$group/",
        "/collection/$group/$name/$entry",
        "/collection/$group/$name/"
      ]
    },
    "/": {
      "filePath": "index.tsx"
    },
    "/file/$group/$name": {
      "filePath": "file/$group/$name.tsx"
    },
    "/collection/$group/": {
      "filePath": "collection/$group/index.tsx"
    },
    "/file/$group/": {
      "filePath": "file/$group/index.tsx"
    },
    "/collection/$group/$name/$entry": {
      "filePath": "collection/$group/$name/$entry.tsx"
    },
    "/collection/$group/$name/": {
      "filePath": "collection/$group/$name/index.tsx"
    }
  }
}
ROUTE_MANIFEST_END */