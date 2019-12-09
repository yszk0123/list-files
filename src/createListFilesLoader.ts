import DataLoader from 'dataloader';
import pLimit from 'p-limit';
import { promises as fs } from 'fs';

export interface ListFilesOptions {
  concurrency?: number;
}

export type ListFilesLoader = DataLoader<string, string[], string>;

interface DefaultListFilesOptions {
  concurrency: number;
}

const defaultOptions: DefaultListFilesOptions = {
  concurrency: 10,
};

function listFiles(filePath: string): Promise<string[]> {
  return fs.readdir(filePath);
}

function listFilesInBatch(
  filePaths: readonly string[],
  { concurrency }: DefaultListFilesOptions,
): Promise<string[][]> {
  const limit = pLimit(concurrency);
  return Promise.all(
    filePaths.map(filePath => limit(() => listFiles(filePath))),
  );
}

export function createListFilesLoader(
  _options: ListFilesOptions = {},
): ListFilesLoader {
  const options = { ...defaultOptions, ..._options };
  return new DataLoader((filePaths: readonly string[]) =>
    listFilesInBatch(filePaths, options),
  );
}
