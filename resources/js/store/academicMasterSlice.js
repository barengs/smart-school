import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchAcademicYears = createAsyncThunk('academicMaster/fetchAcademicYears', async () => {
    const response = await axios.get('/academic-years');
    return response.data;
});

export const saveAcademicYear = createAsyncThunk('academicMaster/saveAcademicYear', async (data) => {
    if (data.id) {
        const response = await axios.put(`/academic-years/${data.id}`, data);
        return { type: 'update', data: response.data };
    } else {
        const response = await axios.post('/academic-years', data);
        return { type: 'add', data: response.data };
    }
});

export const deleteAcademicYear = createAsyncThunk('academicMaster/deleteAcademicYear', async (id) => {
    await axios.delete(`/academic-years/${id}`);
    return id;
});

export const fetchSemesters = createAsyncThunk('academicMaster/fetchSemesters', async (academic_year_id = null) => {
    const url = academic_year_id ? `/semesters?academic_year_id=${academic_year_id}` : '/semesters';
    const response = await axios.get(url);
    return response.data;
});

export const saveSemester = createAsyncThunk('academicMaster/saveSemester', async (data) => {
    if (data.id) {
        const response = await axios.put(`/semesters/${data.id}`, data);
        return { type: 'update', data: response.data };
    } else {
        const response = await axios.post('/semesters', data);
        return { type: 'add', data: response.data };
    }
});

export const deleteSemester = createAsyncThunk('academicMaster/deleteSemester', async (id) => {
    await axios.delete(`/semesters/${id}`);
    return id;
});


const academicMasterSlice = createSlice({
    name: 'academicMaster',
    initialState: {
        academicYears: [],
        semesters: [],
        loading: false,
        error: null,
        initializedAcademicYears: false,
        initializedSemesters: false,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Academic Years
            .addCase(fetchAcademicYears.pending, (state) => { state.loading = true; })
            .addCase(fetchAcademicYears.fulfilled, (state, action) => {
                state.loading = false;
                state.academicYears = action.payload;
                state.initializedAcademicYears = true;
            })
            .addCase(fetchAcademicYears.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(saveAcademicYear.fulfilled, (state, action) => {
                if (action.payload.type === 'add') {
                    state.academicYears.unshift(action.payload.data);
                } else {
                    const index = state.academicYears.findIndex(ay => ay.id === action.payload.data.id);
                    if (index !== -1) state.academicYears[index] = action.payload.data;
                }
                // If it's active, unset others
                if (action.payload.data.is_active) {
                    state.academicYears.forEach(ay => {
                        if (ay.id !== action.payload.data.id) ay.is_active = false;
                    });
                }
            })
            .addCase(deleteAcademicYear.fulfilled, (state, action) => {
                state.academicYears = state.academicYears.filter(ay => ay.id !== action.payload);
            })

            // Semesters
            .addCase(fetchSemesters.pending, (state) => { state.loading = true; })
            .addCase(fetchSemesters.fulfilled, (state, action) => {
                state.loading = false;
                state.semesters = action.payload;
                state.initializedSemesters = true;
            })
            .addCase(fetchSemesters.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(saveSemester.fulfilled, (state, action) => {
                if (action.payload.type === 'add') {
                    state.semesters.unshift(action.payload.data);
                } else {
                    const index = state.semesters.findIndex(s => s.id === action.payload.data.id);
                    if (index !== -1) state.semesters[index] = action.payload.data;
                }
                // If active, unset others in the same academic year
                if (action.payload.data.is_active) {
                    state.semesters.forEach(s => {
                        if (s.id !== action.payload.data.id && s.academic_year_id === action.payload.data.academic_year_id) {
                            s.is_active = false;
                        }
                    });
                }
            })
            .addCase(deleteSemester.fulfilled, (state, action) => {
                state.semesters = state.semesters.filter(s => s.id !== action.payload);
            });
    }
});

export default academicMasterSlice.reducer;
