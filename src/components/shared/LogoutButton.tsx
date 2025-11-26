
"use client";
import { logoutUser } from "@/services/auth/logoutuser";
import { Button } from "../ui/button";


const LogoutButton = () => {

   const handleLogout =  async () => {
     await logoutUser();
   }

    return (
        <div>
            <Button onClick={handleLogout} variant="destructive">Logout</Button>
            
        </div>
    );
};

export default LogoutButton;