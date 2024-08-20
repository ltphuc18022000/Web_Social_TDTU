import {BASE_URL} from "../constant"

async function getDataApiAllnotification(token, last_id){
    try {
      var url = `${BASE_URL}notification`
        if(last_id){
          url = `${BASE_URL}notification?last_notification_id=${last_id}`
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

async function getDataApiUpdateNoti(token, notificationCode){
  try {
      const response = await fetch(`${BASE_URL}notifications/${notificationCode}`,
          {
              method: 'PUT',
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


  async function getDataApiNumberNotification(token){
    try {
        const response = await fetch(`${BASE_URL}number-notification`,
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

export {getDataApiAllnotification, getDataApiUpdateNoti,getDataApiNumberNotification};