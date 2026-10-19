import { useState } from "react";

export function ControlledComponent() {
    const [ name, setName ] = useState("");

    function handleForm(e: React.FormEvent) {
        e.preventDefault();
        console.log(name);
    };

    return (
        <div>
            <h1> Welcome to Controlled Component </h1>
            <form onSubmit={handleForm} >
                <label htmlFor="name" >Name</label>
                <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} />
                <button style={ {"margin": "20px"}} >submit</button>
            </form>
        </div>
    )
};