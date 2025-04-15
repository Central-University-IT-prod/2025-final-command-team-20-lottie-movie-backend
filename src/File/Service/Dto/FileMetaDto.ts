export class FileMetaDto {
  key: string;

  constructor(key: string) {
    this.key = key.replaceAll(' ', '');
  }
}
