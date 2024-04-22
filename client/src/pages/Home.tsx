import React from 'react'

const Home: React.FC = () =>{
    return(
        <div>
            <h1>Welcome to this React Application</h1>
            <br />
            <p>You are not logged in</p>
            <a href = "/login"><button>Login</button></a>
            <a href = "/register"><button>Register</button></a>
        </div>
    )
}

export default Home