export class SignedDoc {
    constructor(
        public id?: string,
        public name?: string,
        public signedXml?: string,
        public docType?: string,
        public entityId?: string,
        public createDate?: Date,
        public modifiedDate?: Date,
        public deleteDate?: Date,
    ) { }
}