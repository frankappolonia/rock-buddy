import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/esm/Button';
import axios from 'axios';
import { useSelector } from "react-redux";
import SignIn from '../firebase/SignIn'
import Card from "@mui/material/Card";
import { CardMedia, Typography } from "@mui/material";
import { CardContent } from "@mui/material";

const SpotifyAuth = () =>{
    const CLIENT_ID = "c427fff192174d81a2004d4d9f006507"
    const REDIRECT_URI = "http://localhost:3000/spotify"
    const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize"
    const RESPONSE_TYPE = "token"

    const [token, setToken] = useState("")
    const [playlists, setPlayLists] = useState([])
    const auth = useSelector((state) => state.auth || null);

    useEffect(() => {
        const hash = window.location.hash
        let token = window.sessionStorage.getItem("token")

        if (!token && hash) {
            token = hash.substring(1).split("&").find(elem => elem.startsWith("access_token")).split("=")[1]
            
            window.location.hash = ""
            window.sessionStorage.setItem("token", token)
        }
        console.log(token);
        setToken(token)
    }, [])

    useEffect(() => {
        async function handleToken() {
            const {data} = await axios.get("https://api.spotify.com/v1/me/playlists", {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                params: {
    
                }
            })
            console.log(data);
            setPlayLists(data.items)
        }
        if (token) {
            handleToken();
        }
    }, [token])

    const logout = () => {
        setToken("")
        window.sessionStorage.removeItem("token")
    }


    const renderPlayLists = () => {
        console.log("Playlists Length",playlists.length);
        return playlists.map(playlist => {
            return (
                <div key={playlist.id}>
        <Card sx={{ maxWidth: 515}} align="center">
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              <code> Playlist Name: {playlist.name}</code>
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <code>
                {playlist.description.length > 100
                  ? playlist.description.substring(0, 100) + "..."
                  : playlist.description}
              </code>
            </Typography>
          </CardContent>
          <br />
          <br />
        </Card>
        <br />
      </div>
    );
        }
    )
    }


    return (
        <div>
            {auth.user === null ? <SignIn></SignIn> : !(token) ? <a href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=streaming%20user-read-email%20user-read-private%20user-library-read%20user-library-modify%20user-read-playback-state%20user-modify-playback-state%20playlist-read-private%20playlist-modify-public%20playlist-modify-private`}>Login to Spotify</a> : <Button onClick={logout}>Logout</Button> }       
            {token ?
                    renderPlayLists()
                    : <h2>Please login</h2>
                }
        </div>
    );

}

export default SpotifyAuth