export class AccountModel {
    constructor(
        public name?: string,
        public token?: string,
        public expiration?: Date,
    ) { }
}