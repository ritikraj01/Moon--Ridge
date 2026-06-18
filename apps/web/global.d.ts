// Allow TypeScript to resolve CSS file imports (e.g. "leaflet/dist/leaflet.css")
// Without this, `import "*.css"` causes TS to fail resolving the importing module,
// which causes false-positive "Cannot find module" errors on the importer.
declare module "*.css" {
  const content: Record<string, string>;
  export default content;
}
