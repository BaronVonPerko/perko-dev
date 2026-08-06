import * as fs from 'fs';
import * as path from 'path';

// read in files in a given directory
// recursively go through subdirectories
const readFilesInDirectory = (dir: string): string[] =>
    fs.readdirSync(dir).reduce((files: string[], file: string) => {
        const name = path.join(dir, file);
        const isDirectory = fs.statSync(name).isDirectory();
        return isDirectory ? [...files, ...readFilesInDirectory(name)] : [...files, name];
    }, []);

const extractRoutesFromFileNames = (routes: string[]): string[] => {
    const mappedRoutes = routes.map(route => {
        return route
            // strip all content files of their content prefix
            .replace('src/content/posts/', '')
            .replace('src/content/talks/', '')
            .replace('src/content/workshops/', '')
            .replace('src/content/portfolio/', '')
            .replace('src/content/projects/', '')
            .replace('src/content/project-privacy/', '')
            .replace('/content/', '')
            .replace('src/content/', '')
            .replace('src/app/pages/', '')
            .replace('src/', '')
            // do analog transformation
            .replace(/^\/(.*?)\/routes|\/app\/routes|\/app\/pages|\.page\.(js|ts)|\.(md)$/g, '')
            .replace(/\[\.{3}.+\]/, '404')
            .replace(/\[([^\]]+)\]/g, ':$1')
            .replace(/index|\(.*?\)$/g, '')
            // replace dots with slashes for routes that have dots in filename (like blog.page.ts -> /blog)
            .replace(/\./g, '/')
            // remove trailing slashes
            .replace(/(?<!^)\/$/, '')
            // remove leading slash if it exists
            .replace(/^\//, '')
    })
    return [... new Set(mappedRoutes)]
}

const basenameWithoutExtension = (file: string): string =>
    path.basename(file).replace(/\.(md|MD)$/, '');

export const extractRoutesToPrerender = () => {
    // first get all "regular" routes similar to analog
    const routes = extractRoutesFromFileNames(readFilesInDirectory('./src/app/pages'));
    // get all "content" routes
    const contentFiles = readFilesInDirectory('src/content');

    // Prefer the blog post slug route so other :slug templates (talks/projects) are not consumed
    const blogPostRouteIndex = routes.findIndex(route => route.includes('blog/post/:slug'));
    const slugRouteIndex = blogPostRouteIndex >= 0
        ? blogPostRouteIndex
        : routes.findIndex(route => route.includes(':slug'));

    const postSlugs = contentFiles
        .filter(file => file.includes('/posts/'))
        .map(file => {
            const extracted = extractRoutesFromFileNames([file])[0];
            return extracted.replace('posts/', '');
        });

    // for our blog :slug route we replace the param with the actual content slug
    if (slugRouteIndex >= 0) {
        const slugRoutes = postSlugs.map(postSlug => routes[slugRouteIndex].replace(':slug', postSlug));
        routes.splice(slugRouteIndex, 1);
        routes.push(...slugRoutes);
    }

    const projectSlugs = contentFiles
        .filter(file => file.includes('/content/projects/'))
        .map(basenameWithoutExtension);

    const projectPrivacySlugs = contentFiles
        .filter(file => file.includes('/content/project-privacy/'))
        .map(basenameWithoutExtension);

    // Remove unresolved projects slug templates and add concrete project routes
    for (const unresolved of ['projects/:slug', 'projects/:slug/privacy']) {
        const index = routes.indexOf(unresolved);
        if (index >= 0) {
            routes.splice(index, 1);
        }
    }

    routes.push(...projectSlugs.map(slug => `projects/${slug}`));
    routes.push(...projectPrivacySlugs.map(slug => `projects/${slug}/privacy`));

    return [...new Set(routes)].map(route => '/' + route);
}
