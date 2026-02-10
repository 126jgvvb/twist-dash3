import { ThemeToggle } from "../components/ThemeToggle";
import { networkObject } from "./network";
import { Loader } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const Login = () => {
    const [statusText, setStatusText] = useState('forgot password?');
    const [isloading, setLoading] = useState(false);
    const [verified, setVerified] = useState(false);
    const navigate = useNavigate();

    const HandleLogin = async (idArray) => {
        for (const id of idArray) {
            const input = document.getElementById(id).value;
            if (input === '' || input === undefined) {
                alert('Invalid input');
                return false;
            }
        }

        const username = document.getElementById('admin-username').value;
        const password = document.getElementById('admin-password').value;

        if ((/[%^&*!#$@]/.test(username))) {
            alert('Username has special characters...please re-validate your input');
            return false;
        }
        
        const LoginData = {
            username: username,
            password: password
        }

        if (await networkObject.isNetworkError()) {
            alert('Network Error');
            return;
        }

        setLoading(true);
        const result = networkObject.sendPostRequest(LoginData, '/admin/login-admin');
        
        return result.then((result) => {
            if (!result.data) {
                setLoading(false);
                alert('this admin does not exist!!');
                setVerified('Authentication failed');
            }
            else {
                  setVerified('verified');  
                  setLoading(false);
                console.log(result.data);
                localStorage.setItem('verified-user', result.data.data.data.data.uniqueID);
                localStorage.setItem('twist-jwt-token', result.data.data.data.data.token.accessToken);              
                navigate('/', { state: { adminID: result.data.data.data.data.uniqueID } })
            }
            })

    }

    const forgotPassword = async () => {
        if (await networkObject.isNetworkError()) {
            alert('Network Error');
            return;
        }

        const adminEmail = prompt('Please enter your registered email');
        if (!(/[@]/.test(adminEmail))) {
            alert('Invalid email input');
            return false;
        }


        setLoading(true);
        const result = networkObject.sendPostRequest({email:adminEmail}, '/admin/forgot-password');
        result.then((result) => {
            if (result) {
                setLoading(false);
                alert('Please check your email for the new password');
                setStatusText('Please check your email for the new password');
                return true;
            }
            else {
                alert('Something went wrong while sending request....');
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
                    <h1 className="text-2xl font-bold mb-2">Welcome Back</h1>
                    <p className="text-muted-foreground">Sign in to your TwistNet dashboard</p>
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
                        <label htmlFor="admin-password" className="text-sm font-medium text-foreground">Admin Password</label>
                        <input 
                            id="admin-password" 
                            type="password" 
                            placeholder="Enter your password" 
                            className="w-full px-4 py-3 rounded-lg bg-muted/20 border border-border/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                        />
                    </div>

                    <button 
                        onClick={() => {HandleLogin(['admin-username','admin-password'])}} 
                        className="w-full gradient-button py-3 font-medium"
                    >
                        {isloading ? <Loader className="animate-spin mx-auto" /> : 'Sign In'}
                    </button>

                    <p 
                        onClick={() => {!isloading && forgotPassword() }} 
                        className={"text-center text-sm text-muted-foreground hover:text-primary cursor-pointer transition-colors"}
                    >
                        {!isloading ? statusText : <Loader className="animate-spin mx-auto" size={16} />}
                    </p>
                </div>

                <div className="text-center mt-6 text-sm text-muted-foreground">
                    <p>Don't have an account? <a href="/signup" className="text-primary hover:underline">Create Account</a></p>
                </div>
            </div>
        </div>
    );
}
