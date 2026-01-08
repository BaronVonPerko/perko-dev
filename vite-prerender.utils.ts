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
export const extractRoutesToPrerender = () => {
    // first get all "regular" routes similar to analog
    const routes = extractRoutesFromFileNames(readFilesInDirectory('./src/app/pages'));
    // there will be one route that has a :slug parameter to indicate that it will be home of our blog
    const slugRouteIndex = routes.findIndex(route => route.includes(':slug'))
    // get all "content" routes
    const contentFiles = readFilesInDirectory('src/content');
    const contentSlugs = extractRoutesFromFileNames(contentFiles);

    // Filter content files that should be handled by the slug route
    // In this app, blog posts are in 'src/content/posts/'
    const postSlugs = contentFiles
        .filter(file => file.includes('/posts/'))
        .map(file => {
            const extracted = extractRoutesFromFileNames([file])[0];
            return extracted.replace('posts/', '');
        });

    // for our :slug route we replace the param with the actual content slug
    const slugRoutes = postSlugs.map(postSlug => routes[slugRouteIndex].replace(':slug', postSlug))
    // remove the placeholder :slug route
    routes.splice(slugRouteIndex,1)
    // add all content routes
    routes.push(...slugRoutes)
    return routes.map(route => '/' + route);
}
