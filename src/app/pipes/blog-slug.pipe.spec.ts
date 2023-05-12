import { BlogSlugPipe } from './blog-slug.pipe';

describe('BlogSlugPipe', () => {
  it('create an instance', () => {
    const pipe = new BlogSlugPipe();
    expect(pipe).toBeTruthy();
  });
});
