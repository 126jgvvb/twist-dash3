import { networkObject } from "../pages/network";
import { useDispatch } from "react-redux";
import { addRouter as addNewRouter }  from "../redux/defaultSlice";
import { useState } from "react";

export const AddRouter=()=>{
const dispatch=useDispatch();
const [isAddingRouter,setIsAdding]=useState(false);

    const addRouter =async () => {
        const routerName = document.getElementById('router-name').value;
        const routerIP = document.getElementById('router-ip').value;
        const holder = document.getElementById('router-digits').value || "+256*********";

        if (routerName === undefined ||
            routerName === '' ||
            routerIP === undefined ||
            routerIP === '' ||
            (/[+#$%@!*-]/.test(routerIP))
            //|| (/[a-zA-Z]/.test(routerIP))
        ) {
            alert('Check your input...something is wrong');
            return false;
        }


        if (await networkObject.isNetworkError()) {
            alert('Network Error');
            return;
        }

        //   alert(admin.uniqueID);
        setIsAdding(true);

        const result = networkObject.sendPostRequest({name:routerName,routerIP:routerIP,holderNumber:holder,connections:0,lastChecked:(new Date().toISOString()) }, '/admin/add-router');
        result.then((result) => {

            if (result) {
                alert('Done adding router');
                dispatch(addNewRouter({ name: routerName, routerIP: routerIP, holderContact: holder }));
                setIsAdding(false);
            }
            else {
                console.error('Something went wrong while polling the server');

            }
        })

    }

    return <div className={'bg-card py-12 px-5  relative mx-8 container my-8 max-h-screen items-center justify-center space-y-8'} >
   
 
 <div className={"grid grid-cols-1 lg:grid-cols-3 gap-7"} >
     <div className={" flex flex-col space-y-3 w-full mx-auto text-xl"} >
  <span>Router Name</span>
  <span><input id="router-name" type="text" placeholder="router name" className={"gradient-border py-1 "} /></span>
     </div>
 
     <div className={" flex flex-col space-y-3 w-full mx-auto text-xl"} >
  <span>Holder Number</span>
  <span><input id="router-digits" type="text" placeholder="router holder`s number" className={"gradient-border  py-1"} /></span>
     </div>

     <div className={" flex flex-col space-y-3 w-full mx-auto text-xl"} >
  <span>Router Mac</span>
  <span><input id="router-ip" type="text" placeholder="router mac address" className={"gradient-border  py-1"} /></span>
     </div>
 
     <button onClick={()=>{addRouter()}} className={"zoe-button px-2 py-2 rounded-full bg-primary text-primary-foreground font-medium transition-all duration-300 hover:shadow-[0_0_10px_rgba(139,92,246,0.5)] hover:scale-105 active:scale-95 w-1/2 ml-18 md:ml-40 lg:w-full lg:ml-[110%] "} >{isAddingRouter?'Saving...':'Save' }</button>
 </div>
 
     </div>  
}
