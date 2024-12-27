import { UserLogin } from "../interfaces/UserLogin";

const login = async (userInfo: UserLogin) => {
  try{
    const response = await fetch('/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userInfo),
    });
    if(!response.ok){
      const errorData = await response.json();
      throw new Error(`Error: ${errorData.message}`);
    }
    const data = await response.json();
    console.log('data from user login', data);
    return data;
    }

  catch (err){
    console.log ('Error from user login', err);
  }
  return Promise.reject('Failed to log in');
  }

  // TODO: make a POST request to the login route



export { login };
