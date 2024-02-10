// // src/redux/reducers/walletReducer.js

// const initialState = {
//   isConnected: false,
//   address: null,
// };

// export default function walletReducer(state = initialState, action) {
//   switch (action.type) {
//     case "CONNECT_WALLET":
//       return {
//         ...state,
//         isConnected: true,
//         address: action.payload,
//       };
//     case "DISCONNECT_WALLET":
//       return {
//         ...state,
//         isConnected: false,
//         address: null,
//       };
//     default:
//       return state;
//   }
// }
