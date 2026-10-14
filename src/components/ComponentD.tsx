import { useContext } from "react";
import { CreateContextUser } from "./ComponentA";

function ComponentD() {
    const value = useContext(CreateContextUser);
    return (
        <>
        <div className="box">
       <h1>Component D</h1>
       <h2>{`Bye ${value}`}</h2>

        </div>
    
        </>
    )
};

export default ComponentD;