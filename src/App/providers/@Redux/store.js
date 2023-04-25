import rootReducer from "./rootReducer";

const { configureStore, getDefaultMiddleware } = require("@reduxjs/toolkit");

const store = configureStore({
    reducer: rootReducer,
    middleware: getDefaultMiddleware=> getDefaultMiddleware().concat([])
})


export default store