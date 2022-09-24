import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  loading: false,
  tweets: [],
  sentiment: [9, 10, 9],
  topics: "",
  selectedDate: new Date(),
  error: null,
};

export const getTweets = createAsyncThunk("tweet/getTweets", async (term, { rejectWithValue }) => {
  try {
    const { data } = await axios.get("/api/tweets/", {
      params: { user_id: term.user_id, selected_date: term.selected_date },
    });
    return data;
  } catch (error) {
    return rejectWithValue(error);
  }
});

const accountDetailSlice = createSlice({
  name: "accountdetail",
  initialState,
  reducers: {
    updateSelectedDate(state, action) {
      state.selectedDate = action.payload;
    },
  },
  extraReducers: {
    [getTweets.pending]: (state) => {
      state.loading = true;
    },
    [getTweets.fulfilled]: (state, action) => {
      const tweets = action.payload;
      const positive = tweets.reduce(
        (acc, cur) => (cur.sentiment === 1 ? ++acc : acc),
        0
      );
      const neutral = tweets.reduce(
        (acc, cur) => (cur.sentiment === 0 ? ++acc : acc),
        0
      );
      const negative = tweets.reduce(
        (acc, cur) => (cur.sentiment === -1 ? ++acc : acc),
        0
      );
      const average = tweets.length ? (((positive - negative) / tweets.length + 1) * 100) / 2 : 0;

      const topicSet = new Set();
      tweets.forEach((tweet) => {
        const words = tweet.topics.split(",");
        words.forEach((word) => {
          topicSet.add(word);
        });
      });

      state.loading = false;
      state.tweets = tweets;
      state.sentiment = [positive, neutral, negative, average.toFixed(0)];
      state.topics = Array.from(topicSet).join(", ");
      state.error = null;
    },
    [getTweets.rejected]: (state, action) => {
      state.loading = false;
      state.accounts = [];
      state.error = action.payload;
    },
  },
});

export const { updateSelectedDate } = accountDetailSlice.actions;

export default accountDetailSlice.reducer;
