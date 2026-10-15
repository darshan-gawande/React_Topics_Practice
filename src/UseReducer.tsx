import { useReducer } from "react";

const initialValue = 0;

function reducer( state: any, action: any ) {
        switch(action) {
            case "Increment":
                return state + 1
            
            case "Decrement":
                return state - 1;
            
            case "Reset":
                return initialValue;

            default: 
            return state
            
        }

}

export function UseReducer() {
    const [count, dispatch] = useReducer(reducer , initialValue );

    return (
        <div className="box">
            <h1>useReducer Hook </h1>
            <h2>Count: { count }</h2>
            <button onClick={() => dispatch("Increment") }>Increment</button>
            <button onClick={() => dispatch("Decrement")}>Decrement</button>
            <button onClick={() => dispatch("Reset")}>Reset</button>

        </div>
    )
};