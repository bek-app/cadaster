export class PagedSortRequestModel<T> {
    constructor(
        public page: number,
        public pageSize: number,
        public sortFields: Array<string> = [],
        public directions: Array<string> = [],
        public filter: T
    ) { }
}