import { Edit2 } from "lucide-react";
import { useState } from "react";
import { networkObject } from "../pages/network";

/*
const adminDetails={
    name:'delos',
    email:"delos@gmail.com",
    id:"errfxssfs",
    contact:"+256741882818"
}*/



export const Footer=({adminDetails})=>{
    const admin=adminDetails;
    const [editAdmin,setEdit]=useState(false);
    const [changingNumber,setIsChangingNumber]=useState(false);
    const [changingPassword,setIsChangingPassword]=useState(false);

    const changePhoneNumber =async () => {
        const newPhoneNumber = document.getElementById("new-phone-number").value;
        if (newPhoneNumber !== '' &&
             newPhoneNumber !== undefined &&
            !(/[a-zA-Z]/.test(newPhoneNumber)) &&
            !(/[*&^%$#@!]/.test(newPhoneNumber)) &&
             newPhoneNumber.length === 10 
        ) {   
    
            if (await networkObject.isNetworkError()) {
                alert('Network Error');
                return;
            }
    
            setIsChangingNumber(true);
            const result = networkObject.sendPostRequest({ phoneNumber: newPhoneNumber, adminID: admin.adminID }, "/admin/add-phone-number");
            result.then((result) => {
                if (result) {   
                    alert('Phone number successfully changed');
                    return dispatch(setPhoneNumber({payload:newPhoneNumber}));
                }
                 else alert('failed to change phone number');
                setIsChangingNumber(false);
            })
        }
        else {
            alert('Invalid phone number input....');
            return false;
        }
    
    }

    const changePassword =async () => {
        const newPassword = document.getElementById("new-password").value;
        if (newPassword !== '' &&
            newPassword !== undefined &&
            (/[a-zA-Z]/.test(newPassword)) &&
            (/[*&^%$#@!]/.test(newPassword)) &&
            newPassword.length >= 8
        ) {
            if (await networkObject.isNetworkError()) {
                alert('Network Error');
                return;
            }
            setIsChangingPassword(true);
            const result = networkObject.sendPostRequest({ newPassword: newPassword,adminID:admin.adminID }, "/admin/change-password");
            result.then((result) => {
                if (result) alert('Password successfully changed');
                else alert('failed to change password');
                setIsChangingPassword(false);
            })
        }
        else {
            alert('Invalid password input,please also make sure to include special characters  and a minmum length of 8 digits');
            return false;
        }

    }

    return <footer className={"py-12 ml-12 md:ml-0 md:px-40 relative border-t border-border "} >
          <div className={`grid mb-4 grid-cols-1  gap-8 mx-auto items-center justify-center ${editAdmin ? 'grid' : 'grid' } `} >
     <div className={" flex  flex-col space-y-3 w-1/2 mx-auto text-sm"} >
  <span>New Password</span>
  <span><input id="new-password" type="text" placeholder="new password" className={"gradient-border p-1"} /></span>
  <button onClick={()=>{changePassword()}} className={"zoe-button rounded-[8px] px-12 " } >{changingPassword?'Saving...':'Save' }</button>
     </div>

     <div className={" flex flex-col space-y-3 w-1/2 mx-auto text-sm"} >
  <span>New Phone Number</span>
  <span><input id="new-phone-number" type="text" placeholder="new phone number" className={"gradient-border p-1"} /></span>
  <button onClick={()=>{changePhoneNumber()}} className={"zoe-button rounded-[8px] px-12 " } >{changingNumber ? 'Saving...':'Save'}</button>
     </div>
 </div>
  
     <div className={"grid grid-cols-1 mx-auto items-center mb-6"} >
    <div className={""} >
        <span>Admin Name:</span><span>{adminDetails.username}</span>
    </div>

    <div>
        <span>Admin ID:</span><span>{adminDetails.uniqueID}</span>
    </div>

    <div>
        <span>Admin Email:</span><span>{adminDetails.email}</span>
    </div>

    <div>
        <span>Contact:</span><span>{adminDetails.phoneNumber}</span>
    </div>

     </div>

 <div className={"  space-x-6 w-full mx-auto text-sm"} >
  <button className={"zoe-button rounded-[8px] px-12 " } >Delete Admin</button>
     </div>
 
 <p className="text-sm mt-8 text-muted-foreground" >&copy; {new Date().getFullYear()} chargedMatrix.co,All rights reserved</p>
    </footer>
}