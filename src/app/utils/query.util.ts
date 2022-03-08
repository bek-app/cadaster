import { format } from "date-fns";
import { Params } from "@angular/router";

export class QueryUtil {
    public static convertToQueryParams(searchQuery: any, queryParams: Params) {
        if (searchQuery) {
            for (const key in searchQuery) {
                if (Object.prototype.hasOwnProperty.call(searchQuery, key)) {
                    if(typeof searchQuery[key] === 'object') {
                        if (Array.isArray(searchQuery[key])) {
                            queryParams[key] = searchQuery[key].join(', ');
                        } else if(searchQuery[key] instanceof Date) {
                            queryParams[key] = format(searchQuery[key], 'yyyy-MM-dd HH:mm:ss');
                        } else  {
                            this.convertToQueryParams(searchQuery[key], queryParams);
                        }
                    } else {
                        queryParams[key] = encodeURIComponent(searchQuery[key]);
                    }
                }
            }
        }
        return queryParams;
    }
}