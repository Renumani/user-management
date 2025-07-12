import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { apiPost, tokenKey, LOGIN } from '../../api/index';

interface AuthState {
    token: string | null;
    loading: boolean;
    error: string | null;
}

interface LoginPayload {
    email: string;
    password: string;
}

export const login = createAsyncThunk<string, LoginPayload, { rejectValue: { error: string } }>(
    'auth/login',
    async (credentials, thunkAPI) => {
        try {
            const response = await apiPost(LOGIN, credentials);
            console.log(response, credentials, "from api auth")
            localStorage.setItem(tokenKey, response.data.token);
            return response.data.token;
        } catch (err: any) {
            return thunkAPI.rejectWithValue(err.response.data || { error: 'Login failed' });
        }
    }
);

const initialState: AuthState = {
    token: localStorage.getItem(tokenKey),
    loading: false,
    error: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            state.token = null;
            localStorage.removeItem(tokenKey);
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(login.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action: PayloadAction<string>) => {
                state.loading = false;
                state.token = action.payload;
            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.error || 'Login failed';
            });
    },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;