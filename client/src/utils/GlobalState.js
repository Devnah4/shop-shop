import React, { createContext, useContext } from "react"; // create is used to instantiate new context object while useContext allows us to use it
import { useProductReducer } from './reducers';

// create the global state object
const StoreContext = createContext();
const { Provider } = StoreContext;

const StoreProvider = ({ value = [], ...props }) => {
    //sets the state and the outputted value of the provider
    const [state, dispatch] = useProductReducer({
        products: [],
        cart: [],
        cartOpen: false,
        categories: [],
        currentCategory: '',
    });
    console.log(state);
    // outputted value
    return <Provider value={[state, dispatch]} {...props} />;
};

// the actual component that will be used to pull the info
const useStoreContext = () => {
    return useContext(StoreContext);
};

// sends out the context to the component that needs it
export { StoreProvider, useStoreContext };