import { useEffect, useState } from 'react';
import './index.css';
import axios from 'axios';


function Search(){
      //Getting the user authorized for use of app
  const CLIENT_ID = 'd34b199bda354693951b0b252f8b0900';
  const REDIRECT_URI = "http://localhost:3000/"
  const AUTH_ENDPOINT = 'https://accounts.spotify.com/authorize'
  const RESPONSE_TYPE = 'token'
//the token is used to fetch data 
  const [token, setToken] = useState("");
  const[searchKey, setSearchKey] = useState("");
  const[artists, setArtists] = useState([]);
  const[tracks, setTracks] = useState([]);


  useEffect(() => {
    const hash = window.location.hash
    let token = window.localStorage.getItem("token")

    if(!token && hash){
      token = hash.substring(1).split("&").find(elem => elem.startsWith("access_token")).split("=")[1]
      window.location.hash = ""
      window.localStorage.setItem("token", token)
    }
    setToken(token)
  },[])


  const logout = () => {
    setToken("")
    window.localStorage.removeItem("token")
  }


// (e) passes the event for setSearchKey, use async because we are awaiting from axios
  const searchArtists = async(e) => {
    e.preventDefault()
    //used axio to fetch the data using get
    const {data} = await axios.get("https://api.spotify.com/v1/search", {
      headers: {
        //our access
        Authorization: `Bearer ${token}`

      },
      //q is search query
      params: {
        q: searchKey,
        type: "artist"
      }
    });
//set the artists to data parameters with artist keyword under items in data
    setArtists(data.artists.items)
    setTracks(data.tracks.items)
  }


  // (e) passes the event for setSearchKey, use async because we are awaiting from axios
  const searchTracks = async(e) => {
    e.preventDefault()
    //used axio to fetch the data using get
    const {data} = await axios.get("https://api.spotify.com/v1/search", {
      headers: {
        //our access
        Authorization: `Bearer ${token}`

      },
      //q is search query
      params: {
        q: searchKey,
        type: "track"
      }
    });
//set the artists to data parameters with artist keyword under items in data
    setTracks(data.tracks.items)
    setArtists(data.artists.items)
  }





//rendering artists to front end 
  const renderArtists = () =>{
    return artists.map(artist => (
      <div key={artist.id}>
        {artist.name} --
        {artist.images.length ? <img width="25%" src={artist.images[0].url} alt=''/> : <div>No Image</div>}
        
      </div>
    ))
  }
//rendering songs to front end 
  const renderTracks = () => {
    return tracks.map(track => (
      <div key={track.id}>
        {track.name} 
        {track.release_date}
      </div>
    ))
  }




//the ? is an if statement and the colon is assigning the next value
  return (
    <div className="App">
      <body className='body'>
        <h1>Search for an Artist or name of song</h1>
        
        {!token ?
        <a href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}`}>Login to Spotify</a>
        : <button id="button1" onClick={logout}>Logout</button>}

        {console.log('token', token)}

      


        {token ? 
        <form onSubmit={searchTracks && searchArtists}>
          <input id="button4" type='text' placeholder='Enter Song or Artist' onChange={e => setSearchKey(e.target.value)}/>
          <button id="button2" onClick={searchTracks}>Search Songs</button> 
          <button id="button3" onClick={searchArtists}>Search Artist</button> 
        </form>
        : <h2>Please log in</h2>
        }
      
        {renderArtists()}
        {renderTracks()}
        
      </body>
    </div>
  );
}
export default Search;