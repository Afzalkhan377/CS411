import Client from "../Client";
import React, {useState, useEffect} from 'react';
import {User} from '../types'
import{MDBBtn,
    MDBContainer,
    MDBRow,
    MDBCol,
    MDBCardBody,
    MDBInput,} from 'mdb-react-ui-kit';
    

    const Home: React.FC=()=>{
        const[email,setEmail]=useState("");
        const[password,setPassword]=useState("");
        const[user,setUser]=useState<User| null>(null)
        const logInUser=async()=>{
            try{
                await Client.post("//localhost:4500/login",{
                    email,
                    password,
                });
                window.location.href="/ai"
            }
            catch (error:any){
                if(error.response.status===401){
                    alert("invalid credentials")
                }
            };

        }
        useEffect(()=>{
            (async()=>{
                try {
                    const resp = await Client.get("//localhost:4500/@me")
                    setUser(resp.data);
                

                }catch(error){
                    console.log("Not authenticated");
                }
            })
            ();
        },
        []);
        useEffect(()=>{
            if (user !=null){
                window.location.href="/ai";

            }
        }, [user]);
        return ( 
            <div
                className='bg-image p-5 text-center shadow-1-strong rounded mb-5 text-white' 
                  style={{
                    backgroundImage:
                      "url('https://mdbcdn.b-cdn.net/img/new/slides/003.webp')",
                    height: "100vh"
                  }}
                >
            <MDBContainer>
            <MDBRow style={{marginTop:'10%'}}>
              <MDBCol md='6' className='text-center text-md-start d-flex flex-column justify-content-center'>
              <h1 className="my-5 display-3 fw-bold ls-tight px-3" style={{color: 'hsl(218, 81%, 85%)'}}>
                         Melodify
                  </h1>
                  <p className='custom-px-3' style={{color: 'hsl(255, 100%, 100%)',marginLeft: '20px' }}>
                  AI-Powered Music Discovery
                  </p>
              </MDBCol>
              <MDBCol md='6' className='position-relative'>
                    <MDBCardBody className='p-5'>
                    <div className="text-center">
                    <h2 style={{alignItems: 'center'}} className="fw-bold mb-2">SIGN IN</h2>
                    <br></br>
                    </div>
                      <MDBInput  labelStyle={{fontSize: '1.1em', paddingBlock: '0.2em', color: 'white'}} wrapperClass='mb-4'  value={email} onChange={(e) => setEmail(e.target.value)} label='Email:' id='form3' type='email' style={{color:'white'}}/>
                      <MDBInput  labelStyle={{fontSize: '1.1em', paddingBlock: '0.2em', color: 'white'}} wrapperClass='mb-4'  value={password} onChange={(e) => setPassword(e.target.value)} label='Password:' id='form4' type='password'style={{color:'white'}}/>
                      <MDBBtn  onClick={() => logInUser()} className='w-100 mb-4' size='lg'>Log in</MDBBtn>
                      <div className="text-center">
                      <p>Don't have an account? <a href="/register" style={{ fontWeight: "bold", color: "lightpurple" }}>Register Here!</a></p>

                      </div>
                      </MDBCardBody>
              </MDBCol>
              </MDBRow>
              </MDBContainer>
              </div>
              );
          };
          export default Home;
    

