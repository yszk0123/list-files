import { createListFilesLoader } from '../createListFilesLoader';

test('should return files', async () => {
  const loader = createListFilesLoader();

  const result = await Promise.all([
    loader.load('fixtures/dir-a'),
    loader.load('fixtures/dir-b'),
  ]);

  expect(result).toContainEqual(['a1.txt', 'a2.txt']);
  expect(result).toContainEqual(['b1.txt', 'b2.txt']);
});
