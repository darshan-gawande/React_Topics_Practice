import { createContext, useState } from "react";
import ComponentB from "./ComponentB";


export const CreateContextUser = createContext("");

function ComponentA() {
    const [ user, setUser ] = useState("Robin");

    return (
    <div className="box">
        <h1>Component A </h1>
        <h2>{`Hello ${user}`}</h2>
        <CreateContextUser.Provider value={user}>
             < ComponentB />
        </CreateContextUser.Provider>
       
    </div>

    )
};

export default ComponentA;