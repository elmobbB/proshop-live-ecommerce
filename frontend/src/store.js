import { configureStore } from '@reduxjs/toolkit';
import { thunk } from 'redux-thunk';//allows asynchronous actions in redux
import { composeWithDevTools } from 'redux-devtools-extension';
import { applyMiddleware,combineReducers,createStore,compose } from 'redux';
import { productListReducer,productDetailsReducer,productDeleteReducer,productUpdateReducer,productCreateReducer,productReviewCreateReducer,productTopRatedReducer } from './reducers/productReducers';
import { cartReducer } from './reducers/cartReducers';
import { userLoginReducer,userRegisterReducer,userDetailsReducer,userUpdateProfileReducer,userListReducer,userDeleteReducer,userUpdateReducer } from './reducers/userReducers';
import { orderCreateReducer,orderDetailsReducer,orderListMyReducer,orderPayReducer,orderListReducer,orderDeliverReducer,} from './reducers/orderReducers';

const reducer = combineReducers({  //go to dev tool and check redux state after adding in
    productList: productListReducer,
    productDetails: productDetailsReducer,
    productDelete: productDeleteReducer,
    productCreate: productCreateReducer,
    productUpdate: productUpdateReducer,
    productReviewCreate: productReviewCreateReducer,
    productTopRated: productTopRatedReducer,


    cart: cartReducer,
    userLogin: userLoginReducer,
    userRegister: userRegisterReducer,
    userDetails: userDetailsReducer,
    userUpdateProfile: userUpdateProfileReducer,
    userList: userListReducer,
    userDelete: userDeleteReducer,
    userUpdate: userUpdateReducer,

    orderCreate: orderCreateReducer,
    orderDetails: orderDetailsReducer,
    orderPay: orderPayReducer,
    orderListMy: orderListMyReducer,
    orderList: orderListReducer,
    orderDeliver: orderDeliverReducer,

})

//pull data from localstorage to our state

const cartItemsFromStorage = localStorage.getItem('cartItems') ?
    JSON.parse(localStorage.getItem('cartItems')) : []

const userInfoFromStorage = localStorage.getItem('userInfo') ?
    JSON.parse(localStorage.getItem('userInfo')) : null

const shippingAddressFromStorage = localStorage.getItem('shippingAddress') ?
    JSON.parse(localStorage.getItem('shippingAddress')) : {}

const initialState = {
    cart: {
        cartItems: cartItemsFromStorage,
        shippingAddress: shippingAddressFromStorage
    },
    userLogin: { userInfo: userInfoFromStorage }
}

const middleware = [thunk]

// const store = createStore(reducer,initialState,composeWithDevTools(applyMiddleware(...middleware)))

const composeEnhancers =
    (typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__)
        ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
        : compose;

const enhancer = composeEnhancers(
    applyMiddleware(...middleware)
    // Add other store enhancers here if needed
);

// Create store
const store = createStore(reducer,initialState,enhancer);
export default store
