export class LoginModel {
    constructor(
        public login?: string,
        public password?: string,
        public certificateData?: string,
        public isCertificate?: boolean
    ) { }
}