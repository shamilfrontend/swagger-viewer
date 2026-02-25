/**
 * Minimal OpenAPI 3 types for parsing and validation.
 */

export interface OpenAPIInfo {
  title?: string
  description?: string
  version?: string
}

export interface OpenAPIServer {
  url: string
  description?: string
}

export interface OpenAPIResponse {
  description: string
  content?: Record<string, unknown>
}

export interface OpenAPIOperation {
  summary?: string
  description?: string
  responses?: Record<string, OpenAPIResponse>
  parameters?: unknown[]
  requestBody?: unknown
}

export interface OpenAPIPaths {
  [path: string]: {
    get?: OpenAPIOperation
    post?: OpenAPIOperation
    put?: OpenAPIOperation
    delete?: OpenAPIOperation
    patch?: OpenAPIOperation
    [method: string]: OpenAPIOperation | undefined
  }
}

export interface OpenAPIDocument {
  openapi: string
  info: OpenAPIInfo
  servers?: OpenAPIServer[]
  paths: OpenAPIPaths
  components?: Record<string, unknown>
}
