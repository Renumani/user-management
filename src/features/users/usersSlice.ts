import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { apiGet, USERS } from '../../api';
import { User } from '../../types';

interface UsersState {
    users: User[];
    loading: boolean;
    error: string | null;
    page: number;
    totalPages: number;
}

const initialState: UsersState = {
    users: [],
    loading: false,
    error: null,
    page: 1,
    totalPages: 1,
};

export const fetchUsers = createAsyncThunk(
    'users/fetchUsers',
    async (_, thunkAPI) => {
        try {
            const res = await apiGet(`${USERS}?per_page=${12}`);
            return res.data;
        } catch (err: any) {
            return thunkAPI.rejectWithValue(err.response?.data?.error || 'Failed to fetch users');
        }
    }
);

const usersSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        setPage: (state, action: PayloadAction<number>) => {
            state.page = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUsers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUsers.fulfilled, (state, action) => {
                state.loading = false;
                state.users = action.payload.data;
                state.totalPages = action.payload.total_pages;
            })
            .addCase(fetchUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { setPage } = usersSlice.actions;
export default usersSlice.reducer;