import { z } from "zod"; // for validaton

//This whole file will be the schema details of the main mongodb schema and checking will be done here
//check for the retardusername
export const retardnameSchema = z
    .string()
    .min(3, "Retardname must be at least 3 characters long")
    .max(15, "Retardname must not exceed 15 characters")
    .regex(
        /^[a-zA-Z0-9]+$/, // checking if it contains letters, numbers and underscores only
        "Retardname can only contain letters , number and underscores"
    )
    .transform((val) => val.toLowerCase().trim());//transforming the value into lowercase value
    //one of the method to use only lowercases 

//This schema will be dedicated to the creation phase of the user such as entering the retardname , his email and password
export const createRetardSchema = z.object({
    body: z.object({
        retardname: retardnameSchema,
        email: z.email("Invalid email format").transform((val) => val.toLowerCase().trim()),
        password: z
            .string()
            .min(8, "Password must be at least 8 characters long")
            .max(128, "Password must not exceed 128 characteres")
            .regex(/[A-Z]/, "Password must contain at least one uppercase letter") // conatin at least one uppercase
            .regex(/[a-z]/, "Password must contain at least one lowercase letter") // contain at least one lowercase
            .regex(/[0-9]/, "Password must contain at least one number") // contain atleast one number
            .regex(
                /[^A-Za-z0-9]/,
                "Password must contain at least one special character" // at least one special character
            ),
        displayName: z
            .string()
            .max(50, "Display name must not exceed 50 characters") // Display Name which will only be shown in the profile must not exceed more than 50 characters
            .optional(),
    })
});
// this schema will be dedicated into the things that are editable for the retard
// display name will be editable , his lie will be editable , his avatar photo (If correct) and the banner url
export const updateRetardSchema = z.object({
    body: z.object({
        displayName: z
            .string()
            .max(50, "Display name must not exceed 50 characters")
            .optional(), 
        lie: z.string().max(500, "Bio must not exceed 500 characters").optional(),
        avatarUrl: z.url("Invalid avatar URL").max(500).optional(),
        bannerUrl: z.url("Invalid banner URL").max(500).optional(),
        //All the edit fields are optional as per the choice of retard to update it or not , doesn't matter

    }),
});


//this schema will be dedicated to the preference section of the main DB schema
//the retard will be able to select his preference for the app through the frontend , these features include nsfw mode , darkmode , emailNotifications (If he wants it or not) , Adult content priority or langugae if the web app supports it in the future
export const updatePreferencesSchema = z.object({
    body:z.object({
        preferences:z.object({
            nsfw:z.boolean().optional(),
            darkMode:z.boolean().optional(),
            emailNotifications:z.boolean().optional(),
            showAdultContent:z.boolean().optional(),
            language:z.string().length(2,"Language must be 2 characters long").optional,
        }).optional(),
        //All these preferences will be optional , completely dependent upon the user choice !!!
    }),
});

//this schema will be dedicated to the functionality of one Retard to goon another Retard , it will exactly work like the follow and follwing system for the other apps
export const goonRetardSchema = z.object({
    //This one will be passed in the parameter if the gooning is gonna happen or not
    params:z.object({
        retardId:z.string().regex(/^[0-9a-fA-F]{24}$/ , "Invalid Id of the retard"),
    })//indication for what type of data will be going through the params
})

//this schema will be dedicated for the functionality when we will need to make the retard name travel through the parameter on the url
export const retardnameParamSchema = z.object({
    params:z.object({
        retardname:retardnameSchema,//got it from the top
    }),
});

//this schema will be dedicated to the functionality when the retard wants to delete his account 
// it will require password for the confirmation
export const deleteAccountSchema = z.object({
    body:z.object({
        password:z.string().min(1,"Password is required while deleting the Account permanently"),
    }),
});


export type CreateRetardInput = z.infer<typeof createRetardSchema>["body"];
export type UpdateRetardInput = z.infer<typeof updateRetardSchema>["body"];
export type updatePreferencesInput = z.infer<typeof updatePreferencesSchema>["body"];



