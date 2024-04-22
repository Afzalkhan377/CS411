import React, {useState, useEffect} from 'react'
import { User } from '../types'
import Client from '../Client'
import {
    MDBNavbar,
    MDBNavbarToggler,
    MDBBtn,
    MDBIcon,
    MDBNavbarNav,
    MDBCard,
    MDBRow,
    
    MDBCardBody,
    
    MDBNavbarItem,
    MDBNavbarLink,
    
    MDBContainer,
    
    MDBCardTitle,
    MDBCardText,

  } from 'mdb-react-ui-kit';

import { BarLoader } from 'react-spinners';
const Playlist: React.FC = () =>{

    const [loading, setLoading] = useState(false);
    const[user, setUser] = useState<User | null>(null)
    const [playlist, setPlaylist] = useState<Record<string, string>>({});


    const logoutUser = async() =>{
        await Client.post("//localhost:4500/logout");
        window.location.href="/"
    }

    const spotifyPlaylist = async() => {
      setLoading(true);
        await Client.post("//localhost:4500/spotify-playlist");
        setLoading(false);
        alert("Transfer Complete -- Check Your Spotify Account");
    }
    useEffect(() => {
        (async () => {
            try{
           const resp = await Client.get("//localhost:4500/@me");
           const parsePlaylist = JSON.parse(resp.data.playlistInfo);
           setPlaylist(parsePlaylist)
           setUser(resp.data);

            }catch(error){
                console.log("Not authenticated");
            }
        })();
    }, []);
    const imageUrl = playlist.imageUrl;
    return( 
        <div>
        {user !== null? ( //If user is logged in
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
            <div className='collapse navbar-collapse' id='navbarExample01'>
              <MDBNavbarNav right className='mb-2 mb-lg-0'>
                <MDBNavbarItem active>
                  <MDBNavbarLink aria-current='page' href='/ai-session'>
                    Home
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

        <MDBContainer fluid style={{height:'100vh'}} className='p-4 background-radial-gradient-2 overflow-hidden'>



<MDBRow className='justify-content-center align-items-center m-5'>

<MDBCard>
  <MDBCardBody className='px-4'>

    <h3 className="fw-bold mb-4 pb-2 pb-md-0 mb-md-1">HERE IS YOUR PLAYLIST!</h3>
    <br/>
    <h6 className="fw mb-4 pb-2 pb-md-0 mb-md-4">You can add this playlist to your Spotify account by clicking the button below</h6>

<div style={{ display: 'flex', justifyContent: 'space-between' }}>
  <div className="card-container" style={{ width: '50%' }}>
    {Object.entries(playlist)
      .filter(([key]) => key !== 'imageUrl')
      .map(([songName, artistName]) => (
        <MDBCard key={songName} className="text-white mb-3" style={{ maxWidth: '70rem', maxHeight: '10rem', backgroundColor: 'pink' }}>
          <MDBCardBody>
            <MDBCardTitle>{songName}</MDBCardTitle>
            <MDBCardText>{artistName}</MDBCardText>
          </MDBCardBody>
        </MDBCard>
      ))}
  </div>
  {imageUrl && (
    <div className="image-container" style={{ maxWidth: '80%', minWidth: '50%', display: 'flex', alignItems: 'center', justifyContent:'center'}}>
      <img src={imageUrl} alt="Playlist" style={{ minWidth:'50%', maxWidth: '90%', maxHeight: '40rem', marginBottom: '30px' }} />
    </div>
  )}
</div>

<MDBRow>
<div className="d-flex justify-content-between">
<MDBBtn size='lg' href="/ai" color="danger" style={{float:"none", marginTop: '20px', }}className='w-50 mb-3'>
    Regenerate
  </MDBBtn>
  <MDBBtn onClick={spotifyPlaylist} size='lg'style={{float:"none", marginTop: '20px', marginLeft: '20px'}} className='w-50 mb-3' color="danger">
    Add to Spotify
  </MDBBtn>
</div>
</MDBRow>
    <div className="loader-container">
      {loading && <BarLoader color="grey" width={800}/>}
    </div>
  </MDBCardBody>
</MDBCard>
</MDBRow>
</MDBContainer>

        </div>
        ) : (
            <div>
                <p>You are not logged in</p>
                <div>
                <a href = "/login"><button>Login</button></a>
                 <a href = "/register"><button>Register</button></a>
                </div>
                </div>
          )}
          </div>

        );

    };
export default Playlist;