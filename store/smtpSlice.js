import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunk to fetch SMTP config
export const fetchSmtpConfig = createAsyncThunk(
  'smtp/fetchConfig',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/smtp/get/${userId}`);
      if (!response.ok) throw new Error('Failed to fetch SMTP config');
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const smtpSlice = createSlice({
  name: 'smtp',
  initialState: {
    config: {
      host: '',
      port: '',
      username: '',
      password: '',
      secure: false,
    },
    loading: false,
    error: null,
  },
  reducers: {
    setSmtpConfig: (state, action) => {
      state.config = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSmtpConfig.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSmtpConfig.fulfilled, (state, action) => {
        state.loading = false;
        state.config = action.payload;
      })
      .addCase(fetchSmtpConfig.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setSmtpConfig } = smtpSlice.actions;
export default smtpSlice.reducer;