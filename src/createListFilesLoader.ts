import DataLoader from 'dataloader';
import pLimit from 'p-limit';
import { promises as fs } from 'fs';

const CONCURRENCY = 10;

function listFiles(filePath: string): Promise<string[]> {
  return fs.readdir(filePath);
}

function listFilesInBatch(filePaths: readonly string[]): Promise<string[][]> {
  const limit = pLimit(CONCURRENCY);
  return Promise.all(
    filePaths.map(filePath => limit(() => listFiles(filePath))),
  );
}

export function createListFilesLoader() {
  return new DataLoader(listFilesInBatch);
}
