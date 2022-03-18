export class SignedDoc {
    constructor(
        public id: string = '00000000-0000-0000-0000-000000000000',
        public name?: string,
        public signedXml?: string,
        public docType?: string,
        public entityId?: string,
        public createDate?: Date,
        public modifiedDate?: Date,
        public deleteDate?: Date,
    ) { }
}