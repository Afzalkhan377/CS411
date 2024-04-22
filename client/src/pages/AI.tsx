import React, {useState, useEffect} from 'react';
import { User } from '../types';
import Client from '../Client';

import {
    MDBNavbar, MDBNavbarToggler, MDBNavbarNav, MDBNavbarItem, MDBNavbarLink,
    MDBBtn, MDBIcon, MDBCard, MDBRow, MDBRadio, MDBCardBody, MDBInput, MDBContainer
  } from 'mdb-react-ui-kit';

  const AI: React.FC = () => {
    const[user, setUser] = useState<User | null>(null)
    const[countSongs, setCountSongs] = useState("");
    const[genre, setGenre] = useState("");
    const[artist, setArtist] = useState("");
    const[type, setType] = useState("");
    const userId = user?.id;

    const preferences = async () => {

      if ( !artist  || !genre || !type || !countSongs) {
        alert('Complete All Fields!')
        return;
      }

      if (!/^\d+$/.test(countSongs) && countSongs !== "") {
        alert("Enter a valid number");
        return;
      } 

      const numSong = parseInt(countSongs, 10);
      if (numSong <= 0 || numSong > 15 ) {
        alert("Please enter a number of songs from 1-15")
        return;
      }

      try {
        console.log(countSongs);
        const resp = await Client.post("//localhost:4500/preferences", {
          countSongs, genre, artist, type, userId
        });
        
        console.log(resp);
        window.location.href = "/playlist";
      }

      catch(error: any) {
        if (error.response.status === 404) {
          alert("Incorrect Credentials")
        }
      };
    }

    const logoutUser = async() =>{
        await Client.post("//localhost:4500/logout");
        window.location.href="/"
    }

    useEffect(() => {
        (async () => {
            try{
           const resp = await Client.get("//localhost:4500/@me");

           setUser(resp.data);
            }catch(error){
                console.log("Not authenticated");
            }
        })();
    }, []);
    return (
    <div>

      {user !== null? ( 

<div >
<header style={{ paddingLeft: 0 }}>
<MDBNavbar expand='lg' light  bgColor='white'>
  <MDBContainer fluid >
    <MDBNavbarToggler
      aria-controls='navbarExample01'
      aria-expanded='false'
      aria-label='Toggle navigation'
    >
      <MDBIcon fas icon='bars' />
    </MDBNavbarToggler>

    {/* logout bar */}
    <div className='collapse navbar-collapse' id='navbarExample01'>
      <MDBNavbarNav right className='mb-2 mb-lg-0'>
        <MDBNavbarItem active>
          <MDBNavbarLink aria-current='page' href='/ai'>
            
          </MDBNavbarLink>
        </MDBNavbarItem>
        <MDBNavbarItem>
          <MDBNavbarLink onClick = {logoutUser} href="/"> Logout</MDBNavbarLink>
        </MDBNavbarItem>

      </MDBNavbarNav>
    </div>

    </MDBContainer >
</MDBNavbar>
</header>

<div
        className="bg-image d-flex justify-content-center align-items-center"
        style={{
          backgroundImage:
            "url('https://mdbcdn.b-cdn.net/img/new/slides/003.webp')",
          height: "100vh"
        }}
      >
<MDBContainer>
<MDBRow className='justify-content-center align-items-center m-5'>

<MDBCard>
  <MDBCardBody className='px-4'>

    <h2 className="fw-bold mb-4 pb-2 pb-md-0 mb-md-5">Tell us what you like!</h2>
    <MDBInput labelStyle={{fontSize: '1.1em', paddingBlock: '0.5em'}} wrapperClass='mb-4' label='How many songs would you like in your playlist?' size='lg' value={countSongs} 
        onChange={(e) => {
            setCountSongs(e.target.value);
          }} type='text'/>    
    <MDBInput labelStyle={{fontSize: '1.1em', paddingBlock: '0.5em'}} wrapperClass='mb-4' label='What genre of music would you prefer for the playlist?'size='lg' value={genre}onChange={(e) => setGenre(e.target.value)}type='text'/>
    <MDBInput labelStyle={{fontSize: '1.1em', paddingBlock: '0.5em'}} wrapperClass='mb-4' label='Who is your favorite artist?'size='lg'  value={artist}onChange={(e) => setArtist(e.target.value)}type='text'/>

        <div className='d-md-flex justify-content-start align-items-center mb-4'>
          <h5 className="fw-bold mb-0 me-4">Music Type</h5>
          <MDBRadio name='inlineRadio' id='inlineRadio7' value='Vocal' onChange={(e) => setType(e.target.value)} label='Vocal' inline />
          <MDBRadio name='inlineRadio' id='inlineRadio8' value='Instrumental' onChange={(e) => setType(e.target.value)} label='Instrumental' inline />
        </div>

    <MDBBtn onClick={() => preferences()}color="success" className='w-20 mb-4 ' size='lg'>Create my playlist</MDBBtn>


  </MDBCardBody>
</MDBCard>

</MDBRow>
</MDBContainer>
</div>
      <div>
      <h1>Logged in</h1>
      <h2>Email: {user.email}</h2>
      <h2>ID: {user.id}</h2>
      <h2>Spotify_ID: {user.spotify_token}</h2>
      <h2>Spotify_Refresh: {user.spotify_refresh}</h2>
      <h2>Playlist_Info: {user.playlistInfo}</h2>
      <button onClick = {logoutUser}>Logout</button>
      </div>
      </div>
      ) : (
        <div className='p-5 text-center' style={{height:'100vh', marginTop:"5%", color: 'black'}}>
          <img object-fit="cover" alt="" style={{width: "40vh", height:"40vh"}}  src={require('./images/not-logged-in.png')}></img>
            <br></br><br></br><br></br>
            <div>
            <h2 className='mb-3'>You are not logged in!</h2>
            <br></br><br></br>
              <div>
              <MDBBtn href="/" color="success" style={{ marginRight: '20px' }} className='w-25 mb-4' size='lg'>Login</MDBBtn>
              <MDBBtn href="/register" color="success" className='w-25 mb-4' size='lg'>Register</MDBBtn>
              </div>
            </div>
        </div>
      )}
    </div>
    );
};
export default AI;