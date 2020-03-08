export function getTotalFileSize(files: Array<File | null> | FileList) {
  let totalSize: number = 0;

  for (let index = 0; index < files.length; index++) {
    const element = files[index];
    totalSize += element ? element.size : 0;
  }

  return totalSize;
}

export function getTotalUploadedSize(files: Array<File | null>, i: number) {
  return files
    .slice(0, i)
    .map(file => (file ? file.size : 0))
    .reduce((t, v) => t + v, 0);
}
