import { useContext, useState } from "react";
import { DatePicker, mergeStyleSets, defaultDatePickerStrings } from "@fluentui/react";
import { useData } from "@microsoft/teamsfx-react";
import { TeamsFxContext } from "../Context";
import { useEffect } from "react";


export function Welcome(props) {
  
  const styles = mergeStyleSets({
    root: { selectors: { '> *': { marginBottom: 15 } } },
    control: { width: '100%', height: 40 },
  });

  useEffect(() => {
    fetchUserData();
  }, []);

  const { teamsfx } = useContext(TeamsFxContext);
  const { loading, data, error } = useData(async () => {
    if (teamsfx) {
      const userInfo = await teamsfx.getUserInfo();
      return userInfo;
    }
  });
  const userName = (loading || error) ? "": data.displayName;

  //data from DB
  const [subData, setSubData] = useState([])

  //sub data state
  const [subDate, setSubDate] = useState('');
  const [subType, setSubType ] = useState('Sub Type');
  const [subHotel, setSubHotel] = useState('');
  const [subTown, setSubTown] = useState('');

  //subType menu state
  const [showMenu, setShowMenu] = useState(false);
  
  //handle subType change
  const handleSubClick = (e) => {
    setSubType(e.target.getAttribute('value'));
    setShowMenu(false)
  }

  //handle sub date change
  const handleDateChange = (value) => {
    setSubDate(value);
    // console.log(value)
  }

  //handle sub hotel change
  const handleHotelChange = (e) => {
    setSubHotel(e.target.value);
  }
  
  //handle sub town change
  const handleTownChange = (e) => {
    setSubTown(e.target.value);
  }

  const url = 'http://localhost:5000/api/v1/subs';

  //handle submit 
  const handleSubmit = () => {
    let submitData = {
      date: subDate,
      subType: subType,
      hotel: subHotel,
      town: subTown,
      user: userName
    }

    let newData = [...subData];

    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(submitData)
    })
      .then((res) => res.json())
      .then((data) => {
        if(data.success){
          newData.push(data.data);
          setSubData(newData)
        }        
      });
  }

  //fetch users sub documents
  const fetchUserData = () => {
    fetch(`${url}?user=${userName}`, {
      method: 'GET',
    }).then((res) => res.json())
    .then((data) => {
      setSubData(data.data);
    });
  }

  return (
    <>
      <div className="border border-black pl-10">
        <h1>{userName ? userName : "Can't find your username"}</h1>
      </div>
      <form className="m-10">
        <div className="grid grid-cols-4">
          <div className="col-span-1 px-2">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="date">
              Enter Date:
            </label>
            <DatePicker
              className={styles.control}
              allowTextInput
              onSelectDate={handleDateChange}
              placeholder="Select Date"
              id='date'
              strings={defaultDatePickerStrings}
            />
          </div>
          <div className="col-span-1 px-2">

            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="subType">
              Select Sub Type:
            </label>
            <div id="subType" className="relative inline-block text-left w-full">
              <div>
                <button onClick={() => setShowMenu(!showMenu)} type="button" className="inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-100" id="menu-button" aria-expanded="true" aria-haspopup="true">
                  {subType}
                  
                  <svg className="-mr-1 ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>

              {showMenu &&
                <div className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none" role="menu" aria-orientation="vertical" aria-labelledby="menu-button" tabIndex="-1">
                  <ul className="py-1" role="none">

                    <li onClick={handleSubClick} className="text-gray-700 block px-4 py-2 text-sm cursor-pointer" value='Meal Sub'>Meal Sub</li>
                    <li onClick={handleSubClick} className="text-gray-700 block px-4 py-2 text-sm cursor-pointer" value='Full Sub'>Full Sub</li>
                    <li onClick={handleSubClick} className="text-gray-700 block px-4 py-2 text-sm cursor-pointer" value='Northern Sub'>Northern Sub</li>
                    
                  </ul>
                </div>
              }

            </div>

          </div>
          <div className="col-span-1 px-2">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="hotel">
              Enter Hotel:
            </label>
            <input 
              type="text" 
              name="hotel" 
              id="hotel" 
              value={subHotel}
              onChange={handleHotelChange} 
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"></input>
          </div>
          <div className="col-span-1 px-2">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="town">
              Enter Town:
            </label>
            <input 
              type="text" 
              name="town" 
              id="town" 
              value={subTown} 
              onChange={handleTownChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"></input>
          </div>
        </div>
        
        <div className="col-span-4 flex mt-5">
          <button onClick={handleSubmit} className="border border-black px-10 py-3 rounded-md m-auto bg-blue-100 text-xl hover:bg-blue-300">Submit</button>
        </div>
      </form>

      <div className="px-5">
        <table className="table-fixed w-full bg-white border border-slate-400">
          <thead>
            <tr>
              <th className="border border-slate-400">Date</th>
              <th className="border border-slate-400">Sub Type</th>
              <th className="border border-slate-400">Hotel</th>
              <th className="border border-slate-400">Town</th>
            </tr>
          </thead>
          <tbody>
            {
              subData.map((sub, index) => {
                return (
                  <tr key={index}>
                    <td className="border border-slate-400 text-center">{new Date(sub.date).toLocaleDateString("en-US", {weekday: 'short', year: 'numeric', month: 'short', day: 'numeric'})}</td>
                    <td className="border border-slate-400 text-center">{sub.subType}</td>
                    <td className="border border-slate-400 text-center">{sub.hotel}</td>
                    <td className="border border-slate-400 text-center">{sub.town}</td>
                  </tr>
                )
              })
            }
          </tbody>
        </table>
      </div>
    </>
  );
}
