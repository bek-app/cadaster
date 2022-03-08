export class PagedResponseModel<T> {
    constructor(
        public total: number,
        public data: Array<T> = []
    ) { }
}