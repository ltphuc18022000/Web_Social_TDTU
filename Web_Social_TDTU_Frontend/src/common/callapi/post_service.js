import {BASE_URL} from "../constant"
async function getPostListHome(token, last_id) {
    try {
        var url = `${BASE_URL}post`
        if(last_id){
          url =  `${BASE_URL}post?last_post_ids=${last_id}`
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
async function getPostListUser(token, usercode) {
    try {
        var url = `${BASE_URL}post/user/${usercode}`
    
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
async function getPosts(token, last_id) {
    try {
        var url = `${BASE_URL}post`
        if(last_id){
          url =  `${BASE_URL}post?last_post_ids=${last_id}`
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


async function createPost(token, formdata) {
    try {
        const response = await fetch(`${BASE_URL}post`,
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

async function deletePost(token, postcode) {
    try {
        const response = await fetch(`${BASE_URL}post/${postcode}`,
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


async function sharePost(token,post_code, content) {
    try {
        const data_body = {
            "content": content
        }
        const response = await fetch(`${BASE_URL}post/${post_code}/share`,
        {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data_body)
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
export {getPostListHome,getPostListUser, getPosts, createPost, deletePost, sharePost};