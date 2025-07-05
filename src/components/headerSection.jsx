

export const HeaderSection=({mainText,subText,clas})=>{

    return <section id="header-section" className={"relative flex flex-col   justfiy-center items-center px-4"} >
        <div className={`mx-auto ml-8 lg:ml-[20%] md:ml-0 text-center max-w-4xl container ${clas} `} >
            <div className={"space-y-6"}>
            <h1 className={"font-bold  text-1xl md:text-2xl "} >
                <span className={"animate-fade-in "} >
                {mainText}
                </span>
            </h1>

            <p className={"text-lg md:text-xl text-muted-foreground opacity-0  animate-fade-in-delay-3"} >
            {subText}
            </p>
            </div>
            </div>

    </section>
}