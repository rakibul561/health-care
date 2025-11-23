/* eslint-disable @typescript-eslint/no-explicit-any */
"use server"

import z from "zod";
import {parse} from "cookie";

const loginValidationZodSchema = z.object({
    email: z.email({
        message: "Email is required",
    }),
    password: z.string("Password is required").min(6, {
        error: "Password is required and must be at least 6 characters long",
    }).max(100, {
        error: "Password must be at most 100 characters long",
    }),
});

export const loginUser = async (_currentState: any, formData: any): Promise<any> => {
    try {
        const loginData = {
            email: formData.get('email'),
            password: formData.get('password'),
        }

        const validatedFields = loginValidationZodSchema.safeParse(loginData);

        if (!validatedFields.success) {
            return {
                success: false,
                errors: validatedFields.error.issues.map(issue => {
                    return {
                        field: issue.path[0],
                        message: issue.message,
                    }
                })
            }
        }

        const res = await fetch("http://localhost:5000/api/v1/auth/login", {
            method: "POST",
            body: JSON.stringify(loginData),
            headers: {
                "Content-Type": "application/json",
            }, 
        })

        const setcookie = res.headers.getSetCookie()

        if (setcookie && setcookie.length > 0) {
            setcookie.forEach((cookie) => {
                
                console.log("Parsed Cookie:", cookie);
                const parsedCookie = parse(cookie);
                console.log("Parsed Cookie Object:", parsedCookie);
            })
        } else {
            throw new Error("No Set-Cookie header found");
        }
        











        console.log("Set-Cookie Header:", setcookie);
       
        const result = await res.json();
 
        console.log({
            res,
            result
        })


        return res;

    } catch (error) {
        console.log(error);
        return { error: "Login is failed" };
    }
}