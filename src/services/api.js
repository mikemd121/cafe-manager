export const fetchCafes = async (location) => {
    const response = await fetch(`https://localhost:44324/api/Cafe/cafesbylocation?location=${location}`);
    return response.json();
  };

  export const fetchCafe = async (id) => {
    const response = await fetch(`/api/cafes/${id}`);
    return response.json();
  };

  export const fetchAllCafes = async () => {
    // Fetch cafes from your API (replace with actual API call)
    const response = await fetch('https://localhost:44324/api/Cafe/cafes');
    return await response.json();
  };
  
  export const saveCafe = async (cafe, id = null) => {
   
    console.log(cafe)

    const method = id ? 'PUT' : 'POST';
    const url = id ? `https://localhost:44324/api/Cafe` : 'https://localhost:44324/api/Cafe/cafe';

    const body = id ? { ...cafe, CafeId: id } : cafe;
    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    return response.json();
  };
  
  export const deleteCafe = async (id) => {
    const response = await fetch(`https://localhost:44324/api/Cafe?cafeId=${id}`, { method: 'DELETE' });
    return response.json();
  };


 

  export const fetchEmployees = async (cafeId) => {
    const response = await fetch(`https://localhost:44324/api/Employee?cafe=${cafeId}`);
    return response.json();
  };

  export const deleteEmployee = async (id) => {
    await fetch(`https://localhost:44324/api/Employee?employeeId=${id}`, { method: 'DELETE' });
  };
  