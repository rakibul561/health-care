/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import z from "zod";
import { parse } from "cookie";
import { cookies } from "next/headers";

const loginValidationZodSchema = z.object({
  email: z.email({
    message: "Email is required",
  }),
  password: z
    .string("Password is required")
    .min(6, {
      error: "Password is required and must be at least 6 characters long",
    })
    .max(100, {
      error: "Password must be at most 100 characters long",
    }),
});

export const loginUser = async (_currentState: any, formData: any) => {
  try {
    let accessTokenObj: any = null;
    let refreshTokenObj: any = null;

    const loginData = {
      email: formData.get("email"),
      password: formData.get("password"),
    };

    const validatedFields = loginValidationZodSchema.safeParse(loginData);

    if (!validatedFields.success) {
      return {
        success: false,
        errors: validatedFields.error.issues.map((issue) => ({
          field: issue.path[0],
          message: issue.message,
        })),
      };
    }

    // Call backend API
    const res = await fetch("http://localhost:5000/api/v1/auth/login", {
      method: "POST",
      body: JSON.stringify(loginData),
      headers: { "Content-Type": "application/json" },
    });

    const setCookies = res.headers.getSetCookie();

    if (!setCookies || setCookies.length === 0) {
      throw new Error("No Set-Cookie header found");
    }

    // Parse cookies safely → convert null-prototype → plain object
    setCookies.forEach((cookieStr) => {
      const parsed = parse(cookieStr);
      const plain = { ...parsed }; // FIX: convert to normal object

      if (plain.accessToken) {
        accessTokenObj = {
          token: plain.accessToken,
          maxAge: plain["Max-Age"],
          path: plain.Path,
        };
      }

      if (plain.refreshToken) {
        refreshTokenObj = {
          token: plain.refreshToken,
          maxAge: plain["Max-Age"],
          path: plain.Path,
        };
      }
    });

    // Validate tokens exist
    if (!accessTokenObj) {
      throw new Error("Access token missing in cookies");
    }

    if (!refreshTokenObj) {
      throw new Error("Refresh token missing in cookies");
    }

    const cookieStore = await cookies();

    // Save accessToken
    cookieStore.set("accessToken", accessTokenObj.token, {
      httpOnly: true,
      secure: true,
      maxAge: parseInt(accessTokenObj.maxAge),
      path: accessTokenObj.path || "/",
    });

    // Save refreshToken
    cookieStore.set("refreshToken", refreshTokenObj.token, {
      httpOnly: true,
      secure: true,
      maxAge: parseInt(refreshTokenObj.maxAge),
      path: refreshTokenObj.path || "/",
    });

    // Return success (only serializable)
    const result = await res.json();

    return {
      success: true,
      data: result,
    };
  } catch (error) {
    console.log(error);
    return { error: "Login failed" };
  }
};
