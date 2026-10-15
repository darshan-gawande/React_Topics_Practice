import { useMemo, useState } from "react";
import {initialValue}  from "./utilities"


 export function UseMemo() {
    const [count, setCount] = useState(0);

    const [items] = useState(initialValue);

    const selectedItems = useMemo( () => items.find((item) => item.id === count) ,[items]);

    return (
        <div className="box">
            <h1>Count: {count}</h1>
            <h1>Selected Item: {selectedItems?.id}</h1>
            <button onClick={() => setCount(count + 1) }>Button</button>

        </div>
    )

 }