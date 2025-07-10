import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchApiConfig = createAsyncThunk(
  'apiConfig/fetch',
  async (userId, { rejectWithValue }) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/openai/${userId}`);
      if (!res.ok) {
        throw new Error('Failed to fetch API config');
      }
      const data = await res.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const saveApiConfig = createAsyncThunk(
  'apiConfig/save',
  async ({ userId, config }, { rejectWithValue }) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/openai/save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, ...config }),
      });
      if (!res.ok) {
        throw new Error('Failed to save API config');
      }
      return config;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const apiConfigSlice = createSlice({
  name: 'apiConfig',
  initialState: {
    config: {
      openai: { apiKey: '', model: 'gpt-3.5-turbo' },
      deepseek: { apiKey: '', model: 'deepseek-chat' },
      gemini: { apiKey: '', model: 'gemini-pro' },
      chatbot: { provider: '' },
      provider: 'openai',
    },
    loading: false,
    error: null,
  },
  reducers: {
    setApiConfig: (state, action) => {
      state.config = action.payload;
      state.provider = action.payload.provider;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchApiConfig.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchApiConfig.fulfilled, (state, action) => {
        state.config = action.payload;
        state.provider = action.payload.provider || 'openai';
        state.loading = false;
      })
      .addCase(fetchApiConfig.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(saveApiConfig.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(saveApiConfig.fulfilled, (state, action) => {
        state.config = action.payload;
        state.provider = action.payload.provider;
        state.loading = false;
      })
      .addCase(saveApiConfig.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setApiConfig } = apiConfigSlice.actions;
export default apiConfigSlice.reducer;