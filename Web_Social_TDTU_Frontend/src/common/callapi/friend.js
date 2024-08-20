import {BASE_URL} from "../constant"

// USER API


// friend request
async function getAllFriendOfUser(token, usercode, lastFriendId =""){
 try {
      var url = `${BASE_URL}get-all-friend/user/${usercode}`
      if(lastFriendId){
        url = `${BASE_URL}get-all-friend/user/${usercode}?last_friend_id=${lastFriendId}`
      }
      const response = await fetch(url,
          {
              method: 'GET',
              headers: {
                  'Content-type': 'application/json',
                  'Authorization': `Bearer ${token}`
              }
          }
      )
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching data:', error.message);
      throw error;
    }
  }

async function createNewFriendRequest(token, usercode){
  try {
      const response = await fetch(`${BASE_URL}friend-request/${usercode}`,
          {
              method: 'POST',
              headers: {
                  'Content-type': 'application/json',
                  'Authorization': `Bearer ${token}`
              }
          }
      )
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching data:', error.message);
      throw error;
    }
  }

  async function acceptFriendRequest(token, usercode){
    try {
        const response = await fetch(`${BASE_URL}accept-friend-request/${usercode}`,
            {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            }
        )
    
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
    
        const data = await response.json();
        return data;
      } catch (error) {
        console.error('Error fetching data:', error.message);
        throw error;
      }
    }

async function deleteFriend(token, usercode){
  try {
      const response = await fetch(`${BASE_URL}delete-friend/${usercode}`,
          {
              method: 'DELETE',
              headers: {
                  'Content-type': 'application/json',
                  'Authorization': `Bearer ${token}`
              }
          }
      )
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching data:', error.message);
      throw error;
    }
  }

  async function denyFriendRequest(token, usercode){
    try {
        const response = await fetch(`${BASE_URL}deny-friend-request/${usercode}`,
            {
                method: 'DELETE',
                headers: {
                    'Content-type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            }
        )
    
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
    
        const data = await response.json();
        return data;
      } catch (error) {
        console.error('Error fetching data:', error.message);
        throw error;
      }
    }
export {acceptFriendRequest, createNewFriendRequest, getAllFriendOfUser, deleteFriend, denyFriendRequest};


