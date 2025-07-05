import { useEffect, useState } from "react";
import { cn } from "../utils";
import { Moon, Sun } from "lucide-react";

export const ThemeToggle=()=>{
    const [isDark,setDark]=useState(0);


    useEffect(()=>{
        const retrievedDark=localStorage.getItem("tracker");
        if(retrievedDark==0){
            setDark(0);
            document.documentElement.classList.remove("dark");
    }
        else{
            setDark(1);
            document.documentElement.classList.add("dark");
        } 
       
    },[]);

    const toggleTheme=()=>{
    
      if(isDark==0){
        setDark(1);
        document.documentElement.classList.add('dark');
        localStorage.setItem('tracker',1);
      }
      else{
        setDark(0); 
        document.documentElement.classList.remove('dark');
        localStorage.setItem('tracker',0);
      }
       }

    return <button className={cn("fixed top-5 right-0 max-sm:right-20 max-sm:hidden mt-1 z-50 p-2 rounded-full transition-colors duration-300",
        "focus:outline-hidden"
    )} onClick={()=>{toggleTheme()}} >
        {
            isDark==0 ?<Moon className={"h-6 w-6 text-blue-300"} /> : <Sun className={"h-6 w-6 text-yellow-300"} /> 
        }
    </button>
}