import { useEffect, useState } from 'react'
import { useDebounce } from 'react-use'
import './App.css'
import Hero from './components/Hero'
import Spinner from './components/Spinner'
import MovieCard from './components/MovieCard'
import { getTrendingMovies, updateSearchCount } from './appwrite.js'


// VITE_APPWRITE_PROJECT_NAME = "React"
// VITE_APPWRITE_ENDPOINT = "https://fra.cloud.appwrite.io/v1"

const API_BASE_URL = 'https://api.themoviedb.org/3'
const API_KEY = import.meta.env.VITE_TMDB_API_KEY
const APP_WRITE_PROJECT_ID = '695d15f6000f92e66959';
const API_OPTIONS = {
  method: 'GET',
  headers:{
    accept: 'application/json',
    Authorization: `Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5ZmJiNzZjNGYwYWRlNjJhMWNiMmRkMmE5NDI2ZTkwMiIsIm5iZiI6MTc2NzY5NjkzNi40MDUsInN1YiI6IjY5NWNlYTI4NGNhMTYwZWY0NTE3OTA0ZiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.-j8RzRBc7XJlZvU6HAeOgybTBDsY8SVCP_V9VAGS67k`
  }
}

function App() {
  
  const [movieList, setMovieList] = useState([])
  const [errorMessage, seterrorMessage] = useState()
  const [isLoading, setisLoading] = useState(false)
  const [searchTerm, setsearchTerm] = useState('')
  const [debounceSearhTerm, setDebounceSearchTerm] = useState('')
  const [trendingMovies, setTrendingMovies] = useState([]);

  useDebounce( ()=> setDebounceSearchTerm(searchTerm), 500, [searchTerm])

  const fetchMovies = async( query = '') => {
    setisLoading(true)
    seterrorMessage('')
    try{
      const endpoint = query
                  ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}` 
                  : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`
      
      //  console.log("get endpoint:", endpoint)
      const response = await fetch(endpoint, API_OPTIONS)
      //  console.log("get response:", response)
      if(!response.ok){
        throw new Error('Failed to fetch movies')
      }
      const data = await response.json()
     
      if(data.response === 'False') {
        seterrorMessage(data.Error || 'Failed to fetch movies')
        setMovieList([])
        return;
      }
      setMovieList(data.results || [])
      //  console.log("get movie list:", data.results)

       if(query && data.results.length > 0){
        await updateSearchCount(query, data.results[0])
       }

    }catch(error){
      console.error(`Error fetching movies: ${error}`)
    }finally{
      setisLoading(false)
    }
  }
   const loadTrendingMovies = async () => {
    try {
      const movies = await getTrendingMovies();
 console.log("get movie list:", movies)
      setTrendingMovies(movies);

    } catch (error) {
      console.error(`Error fetching trending movies: ${error}`);
    }
  }

  useEffect( ()=> {
    fetchMovies(debounceSearhTerm)
  },[debounceSearhTerm])

  useEffect( ()=> {
    loadTrendingMovies()
  },[])

  return (
    <>
      <main>
      <div className="pattern"/>
      <div className="wrapper">
        <Hero />
        <div className="search">
      <div>
        <img src="search.svg" alt="search" />

        <input
          type="text"
          placeholder="Search through thousands of movies"
          value={searchTerm}
          onChange={(e) => setsearchTerm(e.target.value)}
        />
      </div>
       </div>
      {trendingMovies.length > 0 && (
          <section className="trending">
            <h2>Trending Movies</h2>

            <ul>
              {trendingMovies.map((movie, index) => (
                <li key={movie.$id}>
                  <p>{index + 1}</p>
                  <img src={movie.poster_url} alt={movie.title} />
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className='all-movies pt-10'>
          <h2>All Movies</h2>
            {
              isLoading ? (
                <Spinner/>
              ) : errorMessage ? (
                <p className='text-red-300'>{errorMessage}</p>
              ) : (
                <ul>
                  {movieList.map( (movie) => (
                    <MovieCard key={movie.id} movie={movie}/>
                  ))}
                </ul>
              )
            }
        </section>
       
       
      </div>
      </main>
    </>
  )
}

export default App
