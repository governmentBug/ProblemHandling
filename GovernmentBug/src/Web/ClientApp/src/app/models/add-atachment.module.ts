export class AddAtachment {
  constructor(
    public bugId?: number,
    public fileName?: string,
    public fileType?: string,
    public filePath?: string,
  ) {}
}