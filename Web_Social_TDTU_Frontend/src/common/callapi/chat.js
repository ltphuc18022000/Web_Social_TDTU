import {BASE_URL} from "../constant"

async function createConversation(token, usercode){
    try {
        var data_user = {
            "user_code_to_chat": usercode
            }
        var url = `${BASE_URL}conversation`
        const response = await fetch(url, 
            {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(data_user)
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

async function getListConversation(token){
    try {
        var url = `${BASE_URL}conversations`
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
async function getListMess(token, conversationCode, lastMessId){
  try {

      var url = `${BASE_URL}conversation/${conversationCode}/message`
      if(lastMessId){
        url = `${BASE_URL}conversation/${conversationCode}/message?last_message_id=${lastMessId}`
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
  async function createMess(token, conversationCode, text){
    try {
      var data_chat = {
        "conversation_code": conversationCode,
        "text": text
        }
        var url = `${BASE_URL}message`
        const response = await fetch(url, 
            {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(data_chat)
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
async function createGroupConversation(token, listUsercode, name=""){
  try {
      var data_user = {
          "list_user_to_chat": listUsercode,
          "name": name
          }
      var url = `${BASE_URL}group/conversation`
      const response = await fetch(url, 
          {
              method: 'POST',
              headers: {
                  'Content-type': 'application/json',
                  'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify(data_user)
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


async function UpdateGroupConversation(token, conversation_code, listUsercode, name=""){
  try {
      var data_user = {
          "list_user_to_chat": listUsercode,
          "name": name
          }
      var url = `${BASE_URL}group/conversation/${conversation_code}`
      const response = await fetch(url, 
          {
              method: 'POST',
              headers: {
                  'Content-type': 'application/json',
                  'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify(data_user)
          }
      )

      var  data = await response.json();

      return data;
    } catch (error) {
      console.error('Error fetching data:', error.message);
      throw error;
    }
  }

  async function DeleteUserFromGroup(token, conversation_code, listUsercode){
    try {
        var data_user = {
            "list_user_to_chat": listUsercode,
            }
        var url = `${BASE_URL}group/conversation/${conversation_code}`
        const response = await fetch(url, 
            {
                method: 'DELETE',
                headers: {
                    'Content-type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(data_user)
            }
        )
  
        var  data = await response.json();
  
        return data;
      } catch (error) {
        console.error('Error fetching data:', error.message);
        throw error;
      }
    }


async function GetConversationInfo(token, conversation_code){
  try {
      var url = `${BASE_URL}conversation/${conversation_code}`
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
export {getListConversation, createConversation, getListMess, createMess, createGroupConversation, UpdateGroupConversation, DeleteUserFromGroup, GetConversationInfo};