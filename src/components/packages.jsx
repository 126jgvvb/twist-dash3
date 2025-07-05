import { Trash } from "lucide-react";
import { useDispatch } from "react-redux";
import { addPackage, deletePackage } from "../redux/defaultSlice";
import { networkObject } from "../pages/network";
import { useState } from "react";

export const PackagesList=({headerList,list,admin})=>{
    const dispatch=useDispatch();
    const [isAddingPackage,setAdding]=useState(false);

    const addNewPackage =async () => {
        const packName = document.getElementById('new-pack').value;
        const packAmount = document.getElementById('new-amount').value;

        if (packName === '' ||
            packAmount === undefined ||
            packAmount === '' ||
            packName === undefined ||
            (/[+#$%@!*-]/.test(packName)) ||
            (/[+#$%@!*-]/.test(packAmount)) ||
            (/[a-zA-Z]/.test(packAmount)) 
        ) {
            alert('Check your input...something is wrong');
            return false;
        }

        if (await networkObject.isNetworkError()) {
            alert('Network Error');
            return;
        }

        const result = networkObject.sendPostRequest({ newPackage: packName, adminID: admin.uniqueID, price: packAmount },'/admin/set-package');
        result.then((result) => {
           
            if (result) {
                alert('Done adding package');
                dispatch(addPackage({payload:{ duration: packName, price: packAmount }}));
            }
            else {
                console.error('Something went wrong while polling the server');

            }
        })

    }

    return <div className={'bg-card py-12 px-5  relative mx-8 container my-8 max-h-screen items-center justify-center space-y-8'} >
   
   <div className={" mx-auto max-w-4xl container grid grid-cols-2 md:grid-cols-5 "} >
     {
      headerList.map((navItem,key)=>(
          <a key={key} className={"text-foreground font-bold text-xl "} >
              {navItem}
          </a>
      ))
    }
     </div>
   
   <div className={"mx-auto max-w-4xl container md:flex  space-x-3"} >
    <div className={"  rounded-[12px] mb-4 max-w-4xl overflow-y-hidden overflow-x-hidden whitespace-nowrap max-h-80 space-x-4 mx-auto container"} >
    {
        list.map((item,key)=>(
            <div key={key} className={"max-sm:w-[210px]  flex space-x-8   md:grid  md:grid-cols-3 md:gap-5 bg-graph-area mb-6 justify-center items-center text-primary hover:text-foreground"} >
                <span>{item.duration}</span>
                <span>{'ugx.'+item.price}</span>
                <span className={"text-foreground hover:text-primary"} > <Trash onClick={()=>{dispatch(deletePackage({name:(item.name)}))}} size={18} /> </span>
            </div>
        ))
    }
     </div>

<div className={"flex flex-col mt-[-10%] space-y-4"} >
    <div className={" flex flex-col space-y-6 w-full mx-auto text-xl"} >
    <span>Package Name</span>
    <span><input id="new-pack" type="text" placeholder="package name" className={"gradient-border py-1 "} /></span>
    </div>

    <div className={" flex flex-col space-y-6 w-full mx-auto text-xl"} >
    <span>Package Amount</span>
    <span><input id="new-amount" type="text" placeholder="package amount" className={"gradient-border py-1"} /></span>
    </div>

    <button onClick={()=>{addNewPackage()}} className={"zoe-button hover:text-glow"} >{isAddingPackage ?'Saving...':'Save' }</button>
</div>
     </div>

    </div>  
    
    
    
}