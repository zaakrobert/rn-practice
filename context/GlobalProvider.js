import { createContext, useContext, useState, useEffect } from "react";
import { getCurrentUser } from "../lib/appwrite";

const GlobalContext = createContext();

export const useGlobalContext = () => useContext(GlobalContext);

const GlobalProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    getCurrentUser()
      .then((res) => {
        if (res) {
          setIsLoggedIn(true);
          setUser(res);
        } else {
          setIsLoggedIn(false);
          setUser(null);
        }
      })
      .catch((error) => {
        console.log('Error(Glb getCurrentUser): ', error);
      })
      .finally(() => {
        setIsLoading(false);
      })
  }, [])

  // USER INFO
  /*
    {
      "$collectionId": "671e9a5a0004da897aba",
      "$createdAt": "2024-10-28T13:52:43.363+00:00",
      "$databaseId": "671e9a2000234e2503d1",
      "$id": "671f9716003cc8e3f5dc",
      "$permissions": [
          "read(\"user:671f9715002d256c9912\")",
          "update(\"user:671f9715002d256c9912\")",
          "delete(\"user:671f9715002d256c9912\")"
        ],
      "$updatedAt": "2024-10-28T13:52:43.363+00:00",
      "accountId": "671f9715002d256c9912",
      "avatar": "https://cloud.appwrite.io/v1/avatars/initials?name=johnn&project=671e94b60002c5d36f7f",
      "email": "Contactme@johnn.c",
      "likedList": [],
      "username": "johnn",
      "videos": null
    }
  */


  return (
    <GlobalContext.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn,
        user,
        setUser,
        isLoading
      }}
    >
      {children}
    </GlobalContext.Provider>
  )
}

export default GlobalProvider;