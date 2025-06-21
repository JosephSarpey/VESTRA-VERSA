import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  featureImageList: [],
  error: null,
};

// Fetch all feature images
export const getFeatureImages = createAsyncThunk(
  "commonFeature/getFeatureImages",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get("/api/feature/get");
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Add a new feature image
export const addFeatureImage = createAsyncThunk(
  "commonFeature/addFeatureImage",
  async (image, thunkAPI) => {
    try {
      const response = await axios.post("/api/feature/add", { image });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Delete a feature image by ID
export const deleteFeatureImage = createAsyncThunk(
  "commonFeature/deleteFeatureImage",
  async (id, thunkAPI) => {
    try {
      const response = await axios.delete(`/api/feature/delete/${id}`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const commonSlice = createSlice({
  name: "commonFeature",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(getFeatureImages.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getFeatureImages.fulfilled, (state, action) => {
        state.isLoading = false;
        state.featureImageList = action.payload.data || [];
      })
      .addCase(getFeatureImages.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || action.error.message;
      })
      // Add
      .addCase(addFeatureImage.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addFeatureImage.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(addFeatureImage.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || action.error.message;
      })
      // Delete
      .addCase(deleteFeatureImage.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteFeatureImage.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(deleteFeatureImage.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export default commonSlice.reducer;