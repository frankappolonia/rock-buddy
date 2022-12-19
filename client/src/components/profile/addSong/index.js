import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Modal, Select } from "@mui/material";

function App() {
  const [playlists, setPlaylists] = useState([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [songId, setSongId] = useState(null);
  const [addError, setAddError] = useState("");
  const access_token = window.sessionStorage.getItem("token");
  let offset = 0;
  let limit = 50;
  let hasNextPage = true;
  let playlist = [];

  useEffect(() => {
    async function fetchPlaylists() {
      try {
        while (hasNextPage) {
          const response = await axios.get(`https://api.spotify.com/v1/me/playlists?limit=${limit}&offset=${offset}`, {
            headers: {
              Authorization: `Bearer ${access_token}`,
            },
          });

          playlist = playlist.concat(response.data.items);
          offset += limit;
          hasNextPage = response.data.next !== null;
        }
        setPlaylists(playlist);
      } catch (error) {
        console.error(error);
      }
    }
    fetchPlaylists();
  }, []);

  useEffect(() => {
    // Get the song ID from the URL path
    const urlParams = window.location.href;
    const id = urlParams.substring(urlParams.lastIndexOf("/") + 1);
    console.log(id);
    setSongId(id);
  }, []);

  function handlePlaylistChange(event) {
    setSelectedPlaylist(event.target.value);
  }

  function openModal() {
    setModalIsOpen(true);
  }

  function closeModal() {
    setModalIsOpen(false);
  }

  async function handleAddSong() {
    try {
      await axios.post(
        `https://api.spotify.com/v1/playlists/${selectedPlaylist}/tracks`,
        {
          uris: [`spotify:track:${songId}`],
        },
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );
      console.log("Song added to playlist!");
      alert("Song added to playlist!");
      closeModal();
    } catch (error) {
        alert("Error adding song to this playlist, please try other playlist!");
      console.error(error);
    }
  }

  return (
    <div>
      <Button variant="contained" color="primary" onClick={openModal}>
        Add Track to playlist
      </Button>
      <Modal
        open={modalIsOpen}
        onClose={closeModal}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        style={{
          width: "500px",
          maxHeight: "200px",
          overflowY: "auto",
          margin: "0 auto",
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          backgroundColor: "#f2f2f2",
        }}
      >
        <div>
          <h1>Choose a playlist:</h1>
          <Select native value={selectedPlaylist || ""} onChange={handlePlaylistChange}>
            {playlists.map((playlist) => (
              <option key={playlist.id} value={playlist.id}>
                {playlist.name}
              </option>
            ))}
          </Select>
          <Button variant="contained" color="primary" onClick={handleAddSong}>
            Add song
          </Button>
          <Button variant="contained" color="secondary" onClick={closeModal}>
            Close
          </Button>
        </div>
      </Modal>
    </div>
  );
}

export default App;
