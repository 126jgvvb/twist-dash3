


export const ListHeader=({listOfHeadings,listOfItems})=>{

    return <div className={" bg-card py-12 px-5 ml-20 overflow-x-auto  relative mx-5 my-8 max-h-screen items-center justify-center space-y-8"}  >
     
     <div className={" mx-auto max-w-4xl whitespace-nowrap container flex space-x-3  md:grid md:grid-cols-5 "} >
     {
      listOfHeadings.map((navItem,key)=>(
          <a key={key} className={"text-foreground font-bold text-xl "}>
              {navItem}
          </a>
      ))
    }
     </div>


     <div className={" rounded-[12px] max-sm:w-[670px]  whitespace-nowrap max-w-4xl overflow-y-hidden max-h-80 mx-auto "} >
    {
        listOfItems.map((item,key)=>(
            <div key={key} className={" grid grid-cols-5 md:gap-5 bg-graph-area mb-6 w-full justify-center items-center text-primary hover:text-foreground"} >
                <span>{item.code}</span>
                <span>{item.phoneNumber}</span>
                <span>{item.isBound}</span>
                <span>{item.payment}</span>
                <span>{item.expiry/(86400)+'day(s)'}</span>
            </div>
        ))
    }
     </div>
     
  
  </div>
}