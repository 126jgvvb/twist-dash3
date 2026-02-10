import { ThemeToggle } from "../components/ThemeToggle";
import { networkObject } from "./network";
import { useNavigate } from "react-router-dom";
import { CircleNotch } from "phosphor-react";
import { useState } from 'react';

export const SignUp = () => {
    const [verified, setVerified] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const HandleSignup = async (idArray) => {
        for (const id of idArray) {
            const input = document.getElementById(id).value;
            if (input === '' || input === undefined) {
                alert('Invalid input');
                return false;
            }
        }

        const username = document.getElementById('admin-username').value;
        const email = document.getElementById('admin-email').value;
        const password = document.getElementById('admin-password').value;
        const phoneNumber = document.getElementById('admin-phone-number').value;

        if (!(/[@]/.test(email))) {
            alert('Invalid email input');
            return false;
        }

        if ((/[a-zA-Z]/.test(phoneNumber) ||
            (/[*&^%$#@!]/.test(phoneNumber)) ||
            phoneNumber.length !== 10 
        )) {
            alert('Invalid Phone Number Input');
            return false;
        }

        if ((/[0-9]/.test(username))) {
            alert('Invalid username input');
            return false;
        }


        if (!(/[@$%^&@#!]/.test(password))) {
            alert('password too weak, include some special characters');
            return false;
        }

        const newAdminObj = {
            username: username,
            email: email,
            password: password,
            phoneNumber: phoneNumber
        }

        if (await networkObject.isNetworkError()) {
            alert('Network Error');
            return;
        }

        setLoading(true);
        const result = networkObject.sendPostRequest(newAdminObj, '/admin/create-admin');
        result.then((result) => {
            if (result) {
                setLoading(false);
                setVerified('Authentication Successful');
                console.log(result.data.data.data);
          
                navigate('/', { state: { adminID: result.data.data.data.data.uniqueID }})
                return true;  
            }
            else {
                alert('Something went wrong while sending request....');
                setVerified('Authentication UnSuccessful');
                setLoading(false);
            }
        });

    }

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <ThemeToggle />
            
            <div className="glass-card w-full max-w-md p-8">
                <div className="text-center mb-8">
                    <div className="flex justify-center mb-4">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                            <span className="text-2xl font-bold">T</span>
                        </div>
                    </div>
                    <h1 className="text-2xl font-bold mb-2">Welcome Onboard</h1>
                    <p className="text-muted-foreground">Create your TwistNet admin account</p>
                </div>

                <div className="space-y-6">
                    <div className="space-y-2">
                        <label htmlFor="admin-username" className="text-sm font-medium text-foreground">Admin Username</label>
                        <input 
                            id="admin-username" 
                            type="text" 
                            placeholder="Enter your username" 
                            className="w-full px-4 py-3 rounded-lg bg-muted/20 border border-border/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="admin-email" className="text-sm font-medium text-foreground">Admin Email</label>
                        <input 
                            id="admin-email" 
                            type="email" 
                            placeholder="Enter your email" 
                            className="w-full px-4 py-3 rounded-lg bg-muted/20 border border-border/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="admin-phone-number" className="text-sm font-medium text-foreground">Phone Number</label>
                        <input 
                            id="admin-phone-number" 
                            type="tel" 
                            placeholder="Enter phone number" 
                            className="w-full px-4 py-3 rounded-lg bg-muted/20 border border-border/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="admin-password" className="text-sm font-medium text-foreground">Admin Password</label>
                        <input 
                            id="admin-password" 
                            type="password" 
                            placeholder="Enter your password" 
                            className="w-full px-4 py-3 rounded-lg bg-muted/20 border border-border/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                        />
                    </div>

                    <button 
                        onClick={() => {HandleSignup(['admin-username','admin-password','admin-email','admin-phone-number'])}} 
                        className="w-full gradient-button py-3 font-medium"
                    >
                        {loading ? <CircleNotch className="animate-spin mx-auto" size={20} /> : 'Create Account'}
                    </button>
                </div>

                <div className="text-center mt-6 text-sm text-muted-foreground">
                    <p>Already have an account? <a href="/login" className="text-primary hover:underline">Sign In</a></p>
                </div>
            </div>
        </div>
    );
}
