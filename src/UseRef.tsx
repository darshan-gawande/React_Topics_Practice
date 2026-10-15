import { useEffect, useRef  } from "react"

export function UseRef() {
   const inputRef = useRef(null);


   useEffect(() => {
    console.log("COMPONENT RENDERED");
   });
   
   function updateRef() {
    inputRef.current.focus();
    inputRef.current.style.background ="yellow"
    }

    console.log(inputRef);
    
    
    return (
        <div className="box">
            <input ref={inputRef} />
            <button onClick={updateRef}>click me </button>
            
            
        </div>
    )
};

