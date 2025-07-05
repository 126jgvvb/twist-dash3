import { useEffect, useState } from "react";
import { cn } from "../utils";
import { Bell, Circle, Menu, RainbowIcon, X } from "lucide-react";

let currentAdmin="delos X";
const navItems=['Dashboard','Other Admins','Notifications','Change Theme', 'Logout' ];
const admins=[
    {
        name:"delos X",
        pic:"/assets/admin.jpg",
        alt:"delos X admin"
    },
    {
        name:"delos 3X",
        pic:"/assets/admin.jpg",
         alt:"delos 3X admin"
    },
    {
        name:"delos 4X",
        pic:"/assets/admin.jpg",
         alt:"delos 4X admin"
    }
]

export const NavBar=({admin})=>{
    const [isScrolled,setScrolled]=useState(false);
    const [isMenuOpen,setMenu]=useState(false);
    const [isSmallScreen,setScreen]=useState(true);
    let [selectedAdmin,selectAdmin]= useState({pic:"/assets/admin.jpg",name:admin.username});
    let filteredNavItems=navItems.filter((item)=>(
        item!='Notifications' && item!='Change Theme'
    ));


    const handlScroll=()=>{ return setScrolled(window.innerHeight>10); }
    const alterScreen=()=>{ (window.innerWidth<640+"px") ? setScreen(true) : setScreen(false) }


    useEffect(()=>{
        window.addEventListener('scroll',handlScroll);
        window.addEventListener('resize',alterScreen);
        //this filtering returns an array,so we take index at 0
        selectAdmin(admins.filter((admin)=>(admin.name==currentAdmin))[0]);
        
        filteredNavItems=navItems.filter((item)=>(
            item!='Notifications' && item!='Change Theme'
        ));

        return ()=>window.removeEventListener("scroll",handlScroll);
    },[]);


    return <nav className={cn("fixed w-full z-40 transition-all bg-card duration-300",
       isScrolled ? "py-3 bg-background/80 backdrop-blur-md shadow-xs ":"py-5"
    )}  >

        <div className={"container flex items-center justify-between"} >
            
            <span className={"rounded-full border   "} >
                <img className={"w-12 h-12 rounded-full "} src={selectedAdmin.pic} alt={selectedAdmin.name} />
                
                <div className={"overlow-x-hidden max-sm:hidden  w-[10px] top-4 left-35 whitespace-nowrap md:absolute"} >
                <span className={"container flex flex-col "} >
                    <h3>{selectedAdmin.name}</h3>
                    <span className={"text-sm text-primary/70"} >Super Admin</span>
                    </span>
                    </div>

            </span>

            <span className="relative z-20 text-xl font-bold flex" >
                <span className="text-glow text-foreground">TWIST ADMIN</span>
            </span>

  



        { /*desktop nav */ }
        <div className={"hidden md:flex space-x-4"}  >
          {
            filteredNavItems.map((navItem,key)=>(
                <a key={key} className={"text-foreground hover:text-primary transition-colors duration-300"} >
                    {navItem}
                </a>
            ))
          }
        </div>


        { /*mobile nav  */ }
        <button aria-label={`${isMenuOpen ? 'Close Menu': 'Open Menu' }`}
         onClick={()=>setMenu((preValue)=>!preValue)}
         className={"md:hidden p-2 text-foreground z-10"}  >
            {
                isMenuOpen ? <X size={24} /> : <Menu size={24} />
            }
        </button>

        <div className={cn("fixed inset-0 bg-background/95 backdrop-blur-md flex flex-col items-center justify-center",
            "transition-all duration-300 md:hidden",
            isMenuOpen ? "opacity-100 pointer-events-auto":"opacity-0 pointer-events-none"
        )} >
            <div className={"flex flex-col  space-y-5 "}>
            {
                navItems.map((item,key)=>(
                    <a key={key} className={"text-foreground hover:text-primary transition-colors duration-300"} >
                        {item}
                    </a>
                ))
            }
            </div>
        </div>
    </div>
</nav>
}