export class FileUpload {
    constructor(
        public file: File,
        public isFilm: boolean,
        public attachmentId?: number
    ) {}
}