import { lazy, useEffect, useState } from "react";

type Post = { id : number, title: string };

export default function FetchData1() {
    const [ posts, setPost ] = useState<Post[]>([]);
    const [ loading, setLoading ] = useState(true);
    const [error, setError ] = useState<string | null>(null);

    async function load() {
        try {
            const res = await fetch('https://jsonplaceholder.typicode.com/posts');
            if(!res.ok) throw new Error(`Request failed ${res.status}`);
    
            setPost(await res.json());
          
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setLoading((false));
        }
    };

    useEffect( () => {
        load()
    } , []);

    if(loading) return <h1>Loading...</h1>
    if (error) return <p>Error</p>
    
    return (
        <div>
            <ul>
                { posts.map(p => <li key={p.id}> { p.title } </li>  )}
            </ul>
        </div>
    )
}