export class AccountModel {
    constructor(
        public name?: string,
        public token?: string,
        public roles?: string,
        public expiration?: Date,
    ) { }
}
