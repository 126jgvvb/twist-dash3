import { HeaderSection } from "../components/headerSection";
import { ThemeToggle } from "../components/ThemeToggle";
import { networkObject } from "./network";
import { Loader } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const Login=()=>{
    const [statusText,setStatusText] = useState('forgot password?');
    const [isloading, setLoading] = useState(false);
    const [verified,setVerified]=useState(false);
    const navigate=useNavigate();

    const HandleLogin = async (idArray) => {

        for (const id of idArray) {
            const input = document.getElementById(id).value;
            if (input === '' || input === undefined) {
                alert('Invalid nput');
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
            password:password
        }

        if (await networkObject.isNetworkError()) {
            alert('Network Error');
            return;
        }

        setLoading(true);
        const result = networkObject.sendPostRequest(LoginData,'/admin/login-admin');
        
        return result.then((result) => {
            if (!result.data) {
                setLoading(false);
                alert('this admin does not to exist!!');
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

    const forgotPassword =async () => {
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

    return <section className={" mx-7 justify-center mt-[10%] items-center space-y-3"} >
        <ThemeToggle/>
       
        <div className={"  container bg-card items-center text-center text-2xl "} >
        <h1 className={"font-bold p-4 text-1xl md:text-2xl "} >
                <span className={"animate-fade-in "} >
                Welcome Back
                </span>
            </h1>
        </div>

        <div className={"container bg-card mx-auto text-center p-3  justify-center space-y-3"} >
        <div className={" flex flex-col space-y-3 w-full mx-auto text-xl"} >
  <span>Admin username</span>
  <span><input id="admin-username" type="text" placeholder="username" className={"gradient-border py-1 "} /></span>
     </div>

     <div className={" flex flex-col space-y-3 w-full mx-auto text-xl"} >
  <span>Admin Password</span>
  <span><input id="admin-password" type="text" placeholder="password" className={"gradient-border py-1 "} /></span>
     </div>

     <button onClick={()=>{HandleLogin(['admin-username','admin-password'])}} className={"zoe-button px-2 py-2 rounded-full bg-primary text-primary-foreground font-medium  transition-all duration-300 hover:shadow-[0_0_10px_rgba(139,92,246,0.5)]  hover:scale-105 active:scale-95 w-1/2 ml-3 "} >Login</button>
      
      <p onClick={()=>{!isloading&&forgotPassword() }} className={"text-foreground  hover:text-primary text-xl"} >{!isloading?statusText:<Loader className="ml-[50%] animate-spin "/>}</p>
        </div>
    </section>
}