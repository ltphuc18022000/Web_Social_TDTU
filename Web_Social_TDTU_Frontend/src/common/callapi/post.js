import {BASE_URL} from "../constant"
async function LikePost(token, postCode){
    try {
      var url = `${BASE_URL}post/${postCode}/like`
    
        const response = await fetch(url,
            {
                method: 'post',
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

export {LikePost};