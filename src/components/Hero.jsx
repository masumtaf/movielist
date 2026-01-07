import React, { useState } from 'react';
// import Search from './Search';

const Hero = ({ searchTerm, setSearchTerm }) => {
    // const [searchTerm, setSearchTerm] = useState('');
    return (
        <>
            <header>
                <img src="./hero.png" alt="Hero Banner" />
                <h1>Find <span className="text-gradient">Movies</span> You'll Enjoy Without the Hassle</h1>
{/* 
                <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} /> */}
            </header>

        </>
    );
};

export default Hero;