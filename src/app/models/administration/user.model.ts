export class UserModel {
    constructor(
        public id?: string,
        public firstName?: string,
        public lastName?: string,
        public secondName?: string,
        public userName?: string,
        public password?: string,
        public oldPassword?: string,
        public phoneNumber?: string,
        public email?: string,        
        public statusId?: number,
        public statusCode?: string,
        public statusName?: string,
        public organizationName?: string,

        public roleIds: Array<number> = []
    ) { }
}