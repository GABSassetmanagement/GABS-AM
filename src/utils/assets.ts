/**
 * Asset URL Resolver for GABS Financial
 * Handles loading images reliably across all deployment environments:
 * - Localhost / AI Studio Dev Server (port 3000)
 * - Custom domain production (e.g. gabsfinancial.com)
 * - GitHub Pages project repository subpath (e.g. GABSassetmanagement.github.io/GABS-AM/)
 */

export function getAssetUrl(path: string): string {
  if (!path) return '';
  if (
    path.startsWith('http://') ||
    path.startsWith('https://') ||
    path.startsWith('data:') ||
    path.startsWith('blob:')
  ) {
    return path;
  }

  // Strip leading slash or dot-slash
  const clean = path.replace(/^\.?\//, '');

  if (typeof window !== 'undefined') {
    // Detect GitHub Pages repo subpath (e.g. /GABS-AM/)
    const pathParts = window.location.pathname.split('/').filter(Boolean);
    if (
      window.location.hostname.endsWith('github.io') &&
      pathParts.length > 0 &&
      !clean.startsWith(pathParts[0])
    ) {
      const repoName = pathParts[0];
      return `/${repoName}/${clean}`;
    }
  }

  return `./${clean}`;
}
