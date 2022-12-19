import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AddSong from '../profile/addSong';
import { useDispatch, useSelector } from "react-redux";

import Card from 'react-bootstrap/Card';

const TrackPage = (props) => {
	const trackData = props.infoData.foundTrack;
	const trackLyrics = props.infoData.foundLyrics;

	const MAX_LYRIC_LENGTH = 300;
	const [lyricsShowMore, setLyricsShowMore] = useState(false);

	const userState = useSelector((state) => state);

	console.log(userState);

	const handleGetUserPlaylists =(e) => { 
		e.preventDefault();
		console.log("Getting user playlists");

		


	};

	if(!props || !props.infoData || !trackData) return <p>Loading track, please wait... </p>;
	return (
		<div>
			<AddSong />
			<Card style={{
				width: '52rem',
				align: 'center',
				marginLeft: 'auto',
				marginRight: 'auto'
			}}>
				<Card.Header>
					<h1>{trackData.name}</h1>
				</Card.Header>
				<Card.Body>
					<Card.Img style={{ width: '66%' }} src={trackData.album.images[0].url} alt={trackData.name}/>
					<h2>Album:<Link to={`/info/album/${trackData.album.id}`}>{trackData.album.name}</Link> </h2>
					<h2>Artists:</h2>
					<ul>
						{
							trackData.artists.map((artist) => { 
								return <li key={artist.id}><Link to={`/info/artist/${artist.id}`} >{artist.name}</Link></li>
							})
						}
					</ul>
					<h2>Lyrics: </h2>
					{
						trackLyrics.length > MAX_LYRIC_LENGTH && !lyricsShowMore
						? 	<span style={{whiteSpace: 'pre-line'}}>
								{trackLyrics.substring(0, MAX_LYRIC_LENGTH)}...{"\n"}
								<a style={{color: 'blue'}} onClick={() => setLyricsShowMore(true)}>Show More</a>
						  	</span>
						: <span style={{whiteSpace: 'pre-line'}}>
							{trackLyrics}{"\n"}
							<a style={{color: 'blue'}} onClick={() => setLyricsShowMore(false)}>Show Less</a>
						</span >
					}
				</Card.Body>


			</Card>
		</div>
	);
}

export default TrackPage;