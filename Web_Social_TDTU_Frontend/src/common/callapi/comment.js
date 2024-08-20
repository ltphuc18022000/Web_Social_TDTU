import {BASE_URL} from "../constant"

async function getListComment(token, postcode, last_comment_ids){
    try {
      var url = `${BASE_URL}post/${postcode}/comments`
      if(last_comment_ids){
        url = `${BASE_URL}post/${postcode}/comments?last_comment_ids=${last_comment_ids}`
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
async function createNewComment(token, postcode, formdata){
  try {
      const response = await fetch(`${BASE_URL}post/${postcode}/comment`,
          {
              method: 'post',
              headers: {
                  'Authorization': `Bearer ${token}`
              },
              body: formdata
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


async function deleteComment(token, postcode, commentcode){
  try {
      const response = await fetch(`${BASE_URL}post/${postcode}/comment/${commentcode}`,
          {
              method: 'delete',
              headers: {
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
export {getListComment, createNewComment, deleteComment};