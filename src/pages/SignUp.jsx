import { HeaderSection } from "../components/headerSection";
import { ThemeToggle } from "../components/ThemeToggle";
import { networkObject } from "./network";
import { useNavigate } from "react-router-dom";
import { CircleNotch } from "phosphor-react";
import { useState } from 'react';

export const SignUp=()=>{
    const [verified,setVerified]=useState(false);
    const [loading,setLoading]=useState(false);
    const navigate=useNavigate();

    const HandleSignup = async (idArray) => {

        for (const id of idArray) {
            const input = document.getElementById(id).value;
            if (input === '' || input === undefined) {
                alert('Invalid nput');
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
            phoneNumber:phoneNumber
        }

        if (await networkObject.isNetworkError()) {
            alert('Network Error');
            return;
        }

        setLoading(true);
        const result = networkObject.sendPostRequest(newAdminObj,'/admin/create-admin');
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

    return <section className={" mx-2 justify-center mt-[10%] items-center space-y-3"} >
    <ThemeToggle/>
 
    <div className={"mx-auto  text-2xl container bg-card text-center "} >
    <h1 className={"font-bold p-4 text-1xl md:text-2xl "} >
                <span className={"animate-fade-in "} >
                Welcome onBoard
                </span>
            </h1>
    </div>

    <div className={"container bg-card p-3 mx-auto text-center justify-center space-y-3"} >
    <div className={" flex flex-col space-y-1 w-full mx-auto text-xl"} >
<span>Admin username</span>
<span><input id="admin-username" type="text" placeholder="username" className={"gradient-border py-1 "} /></span>
 </div>

 <div className={" flex flex-col space-y-1 w-full mx-auto text-xl"} >
<span>Admin Password</span>
<span><input id="admin-password" type="text" placeholder="password" className={"gradient-border py-1 "} /></span>
 </div>

 <div className={" flex flex-col space-y-1 w-full mx-auto text-xl"} >
<span>Admin Email</span>
<span><input id="admin-email" type="text" placeholder="email" className={"gradient-border py-1 "} /></span>
 </div>

 <div className={" flex flex-col space-y-1 w-full mx-auto text-xl"} >
<span>Phone Number</span>
<span><input id="admin-phone-number" type="text" placeholder="phone number" className={"gradient-border py-1 "} /></span>
 </div>

 <button onClick={()=>{HandleSignup(['admin-username','admin-password','admin-email','admin-phone-number'])}} className={"zoe-button px-2 py-2 rounded-full bg-primary text-primary-foreground font-medium  transition-all duration-300 hover:shadow-[0_0_10px_rgba(139,92,246,0.5)]  hover:scale-105 active:scale-95 w-1/2 ml-3 "} >{loading ?<CircleNotch className="animate-spin" size={20.0}/> :'Signup'}</button>
    </div>
</section>
}