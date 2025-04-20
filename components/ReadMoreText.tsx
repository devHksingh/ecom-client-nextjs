"use client"
import { useState } from "react";

export interface ReadMoreProps{
    text:string;
    limit?:number
}

const ReadMoreText = ({text,limit=65}:ReadMoreProps) => {
    const [isexpanded,setIsExpanded] = useState(false)
    const words = text.split(" ")
    const isLongText = words.length > limit

    let turncatedText = text

    if(isLongText){
        turncatedText = words.splice(0,limit).join(" ")+"..."
    }

  return (
    <span className="gap-2 text-wrap ">
        <p>{isexpanded ? text:turncatedText}
        <button className="mt-2 ml-2 font-medium text-blue-600 hover:underline"
            onClick={()=>setIsExpanded(!isexpanded)}
        >
            {isexpanded? "Read Less": "Read More"}
        </button>
            
        </p>
        
    </span>
  )
}

export default ReadMoreText