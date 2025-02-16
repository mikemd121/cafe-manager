import config from "../config";
export const fetchCafes = async (location) => {
    const response = await fetch(`${config.API_BASE_URL}/Cafe/cafesbylocation?location=${location}`);
    return response.json();
  };

  export const fetchCafe = async (id) => {
    const response = await fetch(`/api/cafes/${id}`);
    return response.json();
  };

  export const fetchAllCafes = async () => {
    // Fetch cafes from your API (replace with actual API call)
    const response = await fetch(`${config.API_BASE_URL}/Cafe/cafes`);
    return await response.json();
  };
  
  export const saveCafe = async (cafe, id = null) => {
   
    const method = id ? 'PUT' : 'POST';
    const url = id ? `${config.API_BASE_URL}/Cafe` : `${config.API_BASE_URL}/Cafe/cafe`;

    const body = id ? { ...cafe, CafeId: id } : cafe;
    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    return response.json();
  };

  export const saveEmployee  =async (employee,id=null)=>{
    const method = id ? 'PUT' : 'POST';
    const url = id ? `${config.API_BASE_URL}/Employee` : `${config.API_BASE_URL}/Employee`;
    const body = id ? { ...employee, id: id,cafeId: employee.cafeId} : {...employee,cafeId: employee.cafeId};
    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    return response.json();
  }
  
  export const deleteCafe = async (id) => {
    const response = await fetch(`${config.API_BASE_URL}/Cafe?cafeId=${id}`, { method: 'DELETE' });
    return response.json();
  };


 

  export const fetchEmployees = async (cafeId) => {
    const response = await fetch(`${config.API_BASE_URL}/Employee?cafe=${cafeId}`);
    return response.json();
  };

  export const deleteEmployee = async (id) => {
    await fetch(`${config.API_BASE_URL}/Employee?employeeId=${id}`, { method: 'DELETE' });
  };
  