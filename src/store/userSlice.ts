import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IUserDto } from "../types/types";

interface UserState {
  users: IUserDto[];
}

const initialState: UserState = {
  users: [],
};

const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    setUsers(state, action: PayloadAction<IUserDto[]>) {
      state.users = action.payload;
    },
    addUser(state, action: PayloadAction<IUserDto>) {
      state.users.push(action.payload);
    },
    removeUser(state, action: PayloadAction<string>) {
      state.users = state.users.filter(
        (user) => user.id.value !== action.payload
      );
    },
  },
});

export const { setUsers, addUser, removeUser } = userSlice.actions;
export default userSlice.reducer;
