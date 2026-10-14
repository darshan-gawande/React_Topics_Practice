import { useContext } from "react";
import ComponentD from "./ComponentD";
import { CreateContextUser } from "./ComponentA";

function ComponentC() {
    const value = useContext(CreateContextUser);
    return (
        <>
        <div className="box">
       <h1> Component C</h1>
        <h2>{`Hello Again ${value}`}</h2>
       < ComponentD />
        </div>
    
        </>
    )
};

export default ComponentC;