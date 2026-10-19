import { useRef } from "react";

export function UnControlledForm() {
    const nameref = useRef<HTMLInputElement>(null);

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        console.log(nameref.current?.value);
    }
    return (
        <div>
            <form onSubmit={handleSubmit}>
            <input type="text" ref={nameref} defaultValue={''} />
            <button type="submit">submit</button>
            </form>
        </div>
    )
};
