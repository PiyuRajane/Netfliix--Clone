import { configureStore, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { API_KEY, TMDB_BASE_URL } from "../utils/Constants";

const initialState = {
  movies: [],
  genresLoaded: false,
  genres: [],
};

export const getGenres = createAsyncThunk("netflix/genres", async () => {
  const { data } = await axios.get(`${TMDB_BASE_URL}/genre/movie/list?api_key=${API_KEY}`);
  return data.genres;
});

const createArrayFromRawData = (array, genres) => array
  .filter((movie) => movie.backdrop_path)
  .map((movie) => ({
    id: movie.id,
    name: movie.original_name || movie.original_title,
    image: movie.backdrop_path,
    genres: movie.genre_ids
      .map((genre) => genres.find(({ id }) => id === genre)?.name)
      .filter(Boolean)
      .slice(0, 3),
  }));

const getRawData = async (api, genres, paging = false) => {
  const moviesArray = [];
  for (let i = 1; moviesArray.length < 60 && i < 10; i++) {
    const { data } = await axios.get(`${api}${paging ? `&page=${i}` : ""}`);
    moviesArray.push(...createArrayFromRawData(data.results, genres));
  }
  return moviesArray;
};

export const fetchDataByGenre = createAsyncThunk("netflix/genre", async ({ genre, type }, thunkAPI) => {
  const { netflix: { genres } } = thunkAPI.getState();
  return getRawData(`${TMDB_BASE_URL}/discover/${type}?api_key=${API_KEY}&with_genres=${genre}`, genres);
});

export const fetchMovies = createAsyncThunk("netflix/trending", async ({ type }, thunkAPI) => {
  const { netflix: { genres } } = thunkAPI.getState();
  return getRawData(`${TMDB_BASE_URL}/trending/${type}/week?api_key=${API_KEY}`, genres, true);
});

const NetflixSlice = createSlice({
  name: "Netflix",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getGenres.fulfilled, (state, action) => {
      state.genres = action.payload;
      state.genresLoaded = true;
    });
    builder.addCase(fetchMovies.fulfilled, (state, action) => {
      state.movies = action.payload;
    });
    builder.addCase(fetchDataByGenre.fulfilled, (state, action) => {
      state.movies = action.payload;
    });
  },
});

export const store = configureStore({
  reducer: {
    netflix: NetflixSlice.reducer,
  },
});
