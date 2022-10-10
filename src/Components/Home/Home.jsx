import React from "react";
import "./Home.scss";
import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
import SearchBox from "../SearchBox";

const apiUrl = "https://movie-task.vercel.app/api/popular?page=1";
const imgUrl = " https://image.tmdb.org/t/p/original";

const Card = ({ img }) => <img className="card" src={img} alt="cover" />;

const Row = ({ title, arr = [] }) => (
  <div className="row">
    <h2>{title}</h2>
    <div>
      {arr.map((item, index) => (
        <Card key={index} img={`${imgUrl}/${item.poster_path}`} />
      ))}
    </div>
  </div>
);

const Home = () => {
  const [upcomingMovies, setUpcomingMovies] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [searchMovieList, setSearchMovieList] = useState([]);
  const [finalSortedData, setFinalSortedData] = useState([]);

  const getMovieRequest = async (searchValue) => {
    // https://movie-task.vercel.app/api/movie?movieId=634649
    if (searchValue) {
      const apiSearch = `https://movie-task.vercel.app/api/search?page=1&query=${searchValue}`;

      const {
        data: { data },
      } = await axios.get(apiSearch);
      if (data) {
        setSearchMovieList(data.results);
      }
    }
  };
  // =========Assessement API call for popular Movies========
  // API : https://movie-task.vercel.app/api/popular?page=1
  const fetchUpcoming = async () => {
    const {
      data: { data },
    } = await axios.get(`${apiUrl}`);
    yearManipulation(data.results);
    // setUpcomingMovies(upcomingMovies);
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from(new Array(20), (val, index) => currentYear - index);

  function sortByYear(year) {
    let sortedData = [];
    upcomingMovies.forEach((movie) =>
      movie.release_date == year ? sortedData.push(movie) : null
    );
    console.log(sortedData);
    setFinalSortedData(sortedData);
    setUpcomingMovies(sortedData);
  }

  function yearManipulation(data) {
    let modifiedYear;
    let newUpComingMovies = data.map((item) => {
      modifiedYear = item.release_date.split("-")[0];
      return {
        ...item,
        release_date: modifiedYear,
      };
    });
    setUpcomingMovies(newUpComingMovies);
    console.log(upcomingMovies);
  }

  useEffect(() => {
    fetchUpcoming();
    getMovieRequest(searchValue);
  }, [searchValue]);

  return (
    <section className="home">
      <SearchBox setSearchValue={setSearchValue} />
      {searchValue && <Row title={"Search"} arr={searchMovieList} />}
      <select
        name="sortByYear"
        id="year"
        onChange={(e) => sortByYear(e.target.value)}
      >
        {years.map((item) => (
          <option defaultValue="sortByYear" key={item}>
            {item}
          </option>
        ))}
      </select>

      {finalSortedData && <Row title={"Popular"} arr={upcomingMovies} />}
    </section>
  );
};

export default Home;
