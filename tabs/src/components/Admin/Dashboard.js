import React, { useEffect, useState } from 'react'
import { Dropdown } from '@fluentui/react/lib/Dropdown';


// const options = [
//     {key: '1', text: 'Bryan Lilly'},
//     {key: '2', text: 'Lilly'},
//     {key: '3', text: 'B Lilly'},
//     {key: '4', text: 'Bryan Lil'},
//     {key: '5', text: 'Bryan L'},
//     {key: '6', text: 'Bryan'},
// ]



const Dashboard = () => {
    const [employeeNames, setEmployeeNames] = useState([]);
    const [employeeData, setEmployeeData] = useState([])
    const [isFetching, setIsFetching] = useState(true);

    useEffect(() => {
        setIsFetching(true);
        fetch('http://localhost:5000/api/v1/subs/admin/employees', {
            method: 'GET'
        })
        .then(res => res.json())
        .then(data => setEmployeeNames(data.data));
        setIsFetching(false)
    }, []);

    const handleDropdownChange = (e, selectedOption) => {
        fetchEmployeeData(selectedOption.text);
    }

    const fetchEmployeeData = (user = '*') => {
        fetch(`http://localhost:5000/api/v1/subs/admin?user=${user}`, {
            method: 'GET'
        })
        .then(res => res.json())
        .then(data => {
            setEmployeeData(data.data);
        });
    }

    const dropdownStyles = {
        dropdown: { width: 300, margin: 'auto' }
    }

    return (
        <>
            {!isFetching &&
                <div className='w-full text-center'>
                    <Dropdown
                        placeholder="Select employee"
                        label="Select Employee"
                        // defaultSelectedKeys={['apple', 'banana', 'grape']}
                        // multiSelect
                        options={employeeNames}
                        styles={dropdownStyles}
                        onChange={handleDropdownChange}
                    />
                </div>
            }
            {employeeData.length !== 0 &&
                <div className='m-5'>
                    <div>
                        <h1>{employeeData[0].user}</h1>
                    </div>
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
                                employeeData.map((sub, index) => {
                                    return (
                                        <tr key={index}>
                                            <td className="border border-slate-400 text-center">{new Date(sub.date).toLocaleDateString("en-US", { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}</td>
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
            }
        </>
    )
}

export default Dashboard