import { useEffect, useState } from "react";

type Photo = { id: string, author: string, download_url: string }

export default function FetchData()  {
    const [photos, setPhoto ] = useState<Photo[]>([]);
    const [loading, setLoading ] = useState(true);
    const [error, setError ] = useState("");

    useEffect(()=> {
        fetch('https://picsum.photos/v2/list?limit=6')
            .then(res => {
                if(!res.ok) throw new Error("Failed to Load Photos");
            return res.json(); 
    })
    .then((data) => setPhoto(data))
    .catch((err) => setError(err.message))
    .finally(() => setLoading(false));
    },[]);

    if (loading) return  <h1>Loading ...</h1>
    if (error)  return  <p>Error {error}</p>

    return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)'}}>
      {photos.map(photo => (
        <figure key={photo.id} style={{ margin: 0 }}>
          <img
            src={photo.download_url}
            alt={`Photo by ${photo.author}`}
            width={300}
            height={200}
            loading="lazy"
            style={{ width: '50%', height: 'auto' }}
          />
          <figcaption>{photo.author}</figcaption>
        </figure>
      ))}
    </div>
  );
}