export class RegistrationRequestModel {
    constructor(
        public organizationBin?: string,
        public organizationName?: string,
        public iin?: string,
        public lastName?: string,
        public firstName?: string,
        public email?: string,
        public phone?: string,
        public password?: string,
        public certificate?: string
    ) { }
}