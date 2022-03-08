export class DictionaryModel {
    constructor(
        public id: number,
        public code?: string,
        public nameRu?: string,
        public nameKz?: string,
        public nameEn?: string,

        public createdDate?: Date,
        public modifiedDate?: Date,
        public deletedDate?: Date,
    ) { }
}