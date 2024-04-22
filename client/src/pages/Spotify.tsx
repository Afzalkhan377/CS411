import React, {useState, useEffect} from 'react'
import {User} from '../types'
import Client from '../Client'
import { MDBNavbar,
  MDBNavbarToggler,
  MDBBtn,
  MDBIcon,
  MDBNavbarNav,
  MDBNavbarItem,
  MDBNavbarLink,
  MDBContainer } from 'mdb-react-ui-kit';


const Spotify: React.FC = () =>{
    const[user, setUser] = useState<User | null>(null)
    const logoutUser = async() =>{
        await Client.get("//localhost:4500/spotifyLogin");
        window.location.href="/"
    }
    useEffect(() => {
      (async () => {
          try {
              const resp = await Client.get("//localhost:4500/@me");
              setUser(resp.data);
          } catch (error) {
              console.log("Not authenticated");
          }
      })();
  }, []);
    
  
  if(user!== null && user.spotify_token!==""){
      window.location.href = "/ai";
    }
    return (
      <header style={{ paddingLeft: 0 }}>
        <MDBNavbar expand='lg' light bgColor='white'>
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
                  <MDBNavbarLink aria-current='page' href='/ai'> Home </MDBNavbarLink>
                </MDBNavbarItem>
                <MDBNavbarItem>
                  <MDBNavbarLink onClick = {logoutUser} href="/"> Logout </MDBNavbarLink>
                </MDBNavbarItem>

              </MDBNavbarNav>
            </div>
          </MDBContainer >
        </MDBNavbar>

        <div className='bg-image p-5 text-center shadow-1-strong rounded mb-5 text-white' 
          style={{backgroundImage: "url('https://mdbcdn.b-cdn.net/img/new/slides/003.webp')", height: "100vh"}}>
            <img object-fit="cover" alt="" style={{width: "40vh", height:"40vh"}}  src={require('./images/oauth-image.png')}></img>
            <br></br><br></br><br></br>
          <h1 className='mb-3'>Login to continue to your Spotify account</h1>
          <br></br>
          <MDBBtn href="http://localhost:4500/spotifyLogin" color="success" className='w-25 mb-4' size='lg'>Connect to Spotify</MDBBtn>
        </div>
      </header>
    );
};

export default Spotify;