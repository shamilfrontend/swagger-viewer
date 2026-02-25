/**
 * Default OpenAPI specification shown on first load.
 */
export const DEFAULT_SPEC_YAML = `openapi: 3.0.0
info:
  title: Sample API
  description: API документация
  version: 1.0.0
servers:
  - url: https://api.example.com/v1
paths:
  /users:
    get:
      summary: Returns list of users
      responses:
        '200':
          description: Successful response
`;
