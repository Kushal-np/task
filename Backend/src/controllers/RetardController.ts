import { Response, Request } from "express";
import Retard from "../models/Retard";
import { AuthRequest } from "../types";
import type { IRetardResponse } from "../types/Retard/Retard";
import type { IRetard } from "../types/Retard/Retard";

import { UpdateRetardInput, updatePreferencesInput } from "../validators/Retard/RetardSchema";
import { RegisterInput } from "../validators/Retard/authSchema";
import { generateOtp } from "../utils/generateOtp";
import { emailTemplates } from "../utils/emailTemplates";
import { sendEmail } from "../utils/emailServices";

const formatRetardResponse = (retard: IRetard): IRetardResponse => ({
    id: retard._id.toString(),
    retardname: retard.retardname,
    email: retard.email,
    displayName: retard.displayName,
    lie: retard.lie,
    avatarUrl: retard.avatarUrl,
    bannerUrl: retard.bannerUrl,
    drama: retard.drama,
    goonersCount: retard.goonersCount,
    gooningCount: retard.gooningCount,
    isVerified: retard.isVerified,
    createdAt: retard.createdAt,

})


export const registerUser = async (req: Request<{}, {}, RegisterInput>, res: Response): Promise<void> => {
    try {
        console.log("WEEEEEEEEEEEE AREEEEEEEEEEEE HEREEEEEEEEEEEEE")
        const { retardname, email, password, displayName } = req.body;
        console.log(retardname , email , password , displayName);
        const existingUser = await Retard.findOne({
            $or: [{ email }, { retardname }],
        });

        if (existingUser) {
            if (existingUser.email === email) {
                res.status(400).json({
                    success: false,
                    error: "Email already exists",
                })
                return;
            }
            if (existingUser.retardname === retardname) {
                res.status(400).json({
                    success: false,
                    error: "Retardname already exists"
                })
                return;
            }
        }

        const otp = generateOtp();
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

        const retard = await Retard.create({
            email,
            retardname,
            passwordHash: password,
            displayName: displayName || retardname,
            otp,
            otpExpiry,
            isVerified: false,
        })

        try {
            const template = emailTemplates.verificationOtp(otp);
            await sendEmail({
                to: email,
                subject: template.subject,
                html: template.html
            });

            res.status(200).json({
                success: true,
                message: "Registration successfull , OTP sent successfully !!!",
                data: {
                    email: retard.email,
                    retardname: retard.retardname,
                },
            });


        }
        catch (emailError) {
            await Retard.findByIdAndDelete(retard._id);
            console.log("Email sending error", emailError);
            res.status(500).json({
                success: false,
                error: "Failed to send the verfication email. Please try again",
                message:(emailError as Error).message

            });
        }


    }
    catch (error) {
        console.log("Registration error", error);
        if ((error as any).code === 1100) {
            const field = Object.keys((error as any).keyPattern)[0];
            res.status(400).json({
                success: false,
            });
            return;
        }
        res.status(500).json({
            success: false,
            error: "Registration failed. Please try again."
        });
    }
}