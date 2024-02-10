// // src/redux/store.js

// import { createStore, combineReducers } from "redux";
// import { persistStore, persistReducer } from "redux-persist";
// import storage from "redux-persist/lib/storage";
// import walletReducer from "./reducers/walletReducer";

// const rootReducer = combineReducers({
//   wallet: walletReducer,
//   // ... other reducers
// });

// const persistConfig = {
//   key: "root",
//   storage,
//   whitelist: ["wallet"],
// };

// const persistedReducer = persistReducer(persistConfig, rootReducer);

// export const store = createStore(persistedReducer);
// export const persistor = persistStore(store);
