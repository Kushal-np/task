import {Document , Types} from "mongoose";


export interface IRetardPreferences {
    nsfw:boolean;
    darkmode:boolean;
    emailNotifications:boolean;
    showAdultContent:boolean;
    language:string;
}

export interface IOAuthProvideres{
    google?:{
        id:string;
        email:string;
    };
    github?:{
        id:string;
        email:string;
    };
}

export interface IDrama {
    rant:number;
    complain:number;
    total:number;
}

export interface IRetard extends Document {
    _id:Types.ObjectId ; 
    retardname:string;
    email:string;
    passwordHash:string;
    displayName:string;
    lie:string;
    avatarUrl:string;
    bannerUrl:string;
    drama:IDrama;
    goonersCount:number;
    gooningCount:number;
    gooners:Types.ObjectId[];
    gooning:Types.ObjectId[];
    joinedSubFeddits:Types.ObjectId[];
    GatekeepedSubFeddits:Types.ObjectId[];
    savedRants:Types.ObjectId[];
    hypedRants:Types.ObjectId[];
    trashedRants:Types.ObjectId[];
    hypedComplains:Types.ObjectId[];
    trashedComplains:Types.ObjectId[];
    preferences:IRetardPreferences;
    refreshTokens:string[];
    oauthProviders:IOAuthProvideres;
    isBanned:boolean;
    isVerified:boolean;
    otp?:string;
    otpExpiry?:Date;
    createdAt:Date;
    updatedAt:Date;
    matchPassword(enteredPassword:string):Promise<boolean>;

}



export interface IRetardResponse {
    id:string;
    retardname:string;
    email:string;
    displayName:string;
    lie:string;
    avatarUrl:string;
    bannerUrl:string;
    drama:IDrama; //can be used with generic , not for now , will change later 
    goonersCount:number;
    gooningCount:number;
    isVerified:boolean;
    createdAt:Date;
}