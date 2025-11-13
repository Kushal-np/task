import {Request} from "express";
import { JwtPayload } from "jsonwebtoken";
//Extending the Auth Request with all the express requests types
export interface AuthRequest<P=any , ResBody = any , ReqBody = any , ReqQuery = any> extends Request<P , ResBody , ReqBody , ReqQuery>{
    user?:{
        id:string;
    };
}

//JWT payload interface type
export interface  JWTPayload extends JwtPayload{
    id:string ; 
}
//Response in case of success
export interface SuccessResponse<T=any>{
    success:true ;
    message?:string ; 
    data?:T;
}
//Response if any error occurs
export interface ErrorResponse<T=any> {
    success:false ; 
    error:string ; 
    details?:Array<{
        field:string;
        message:string;
    }>;
}

//Pagination types for Pagination query
export interface PaginationQuery {
    page?:number ; 
    limit?:number; 
    sort?:string;
    order?:"asc"|"dsc";
}

//Type for pagination response
export interface PaginatedResponse<T>{
    success:true ;
    data:T[];
    pagination:{
        page:number;
        limit:number;
        total:number;
        totalPages:number;
        hasNext:boolean;
        hasPrev:boolean;
    };
}



