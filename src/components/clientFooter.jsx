import { Edit2 } from "lucide-react";
import { useState } from "react"

const adminDetails={
    contact:"+256741882818"
}

export const ClientFooter=()=>{

    return <footer className={"py-12  md:ml-0 md:px-40 relative border-t border-border "} > 
     <div className={"grid grid-cols-1 mx-auto items-center mb-6"} >
    <div>
        <span>Contact:</span><span>{adminDetails.contact}</span>
    </div>
     </div>
 
 <p className="text-sm text-muted-foreground" >&copy; {new Date().getFullYear()} chargedMatrix.co,All rights reserved</p>
    </footer>
}