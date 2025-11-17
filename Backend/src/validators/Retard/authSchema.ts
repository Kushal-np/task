// This file will only contain the things specific to the authentiation 
// Difference between the Retardschema and the authSchema?
// authSchema contains the functionalities like password checking , we are writing it again for the reusability so that we can use it again and again and 
// maintain the integrity for the "create" one

import z from "zod";
import { retardnameSchema } from "./RetardSchema";
import { register } from "module";

//firstly it makes sense to check the email Schema {it will be reusable}
const emailSchema = z 
    .string()
    .min(1,"Email is required")
    .email("Invalid email format")
    .transform((val)=>val.toLowerCase().trim());

// this one will be for password schema after the above one for email schema , we will verify it like the previous one
const passwordSchema = z
    .string()
    .min(8 , "Password Must be 8 characters long" )
    .max(128 , "Password Must not exceed 128 characters")
    .regex(/[A-Z]/,"Password must contain at least one uppercase letter")
    .regex(/[a-z]/,"Password must contain at least one lowercase letter")
    .regex(/[0-9]/,"Password must contain at least one number")
    .regex(/[^A-Za-z0-9]/,"Password must contain at least one special character");

// this schema is for the OTP function , we are likely to send only exactly 6 digit otp
const otpSchema = z
    .string()
    .length(6 , "OTP must be only 6 digits")
    .regex(/^\d{6}$/, "OTP must contain only numbers"); // Regex check so that only 6 i.e also number only


//WE will implemet the Auth Function {Controller} schema now

//This will be the register/Signup schema , we will be reusing the already declared/defined Schemas from this and the other file in the same directory
export const registerSchema = z.object({
    email: emailSchema,
    password: passwordSchema,
    retardname: retardnameSchema,
    displayName: z.string().max(50).optional(),
});


//This will be for the login/Signin Schema , we will be reusing these on the API services 
export const loginSchema = z.object({
    body:z.object({
        email:emailSchema , 
        password:z.string().min(1,"Password is required"),
    }),
});


//This will be for the otp verification step now, it will only be in case if the O auth is being used
export const verifyOtpSchema = z.object({
    body:z.object({
        email:emailSchema,//Reference from the other file
        otp:otpSchema,// reference from above , the otp verify function already written one
    }),
});


//This will be for the reset password function , it will be done only after logging in otherwise it shoudn't be accessible
export const resetPasswordSchema = z.object({
    body:z.object({
        email:emailSchema,// we need only email to send notificatoin to the nodemailer that we will be using further on this project only
    }),
})

//for the confirmation of resetting the password option
export const confirmResetSchema = z.object({
    body:z.object({
        email:emailSchema,
        otp:otpSchema ,//reference from above
        newPassword:passwordSchema //entered password should also follow the all criteria even if it's new
    }),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>["body"];
export type VerifyOtpInput = z.infer<typeof verifyOtpSchema>["body"];
export type resetPasswordSchema = z.infer<typeof resetPasswordSchema>["body"];
export type ConfirmResetInput = z.infer<typeof confirmResetSchema>["body"];