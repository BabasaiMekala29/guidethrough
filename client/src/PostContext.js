import React, { createContext, useState, useEffect } from "react";

export const PostContext = createContext({});

export function PostContextProvider({ children }) {

    const [postInfo,setPostInfo] = useState(null);
    return (
        <PostContext.Provider value={{ postInfo,setPostInfo }}> {/* Pass isLoading state */}
            {children}
        </PostContext.Provider>
    );
}