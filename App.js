/**
 * Defining DOM elements
 */
const textDiv = document.getElementById('fetchedPosts');
const usersDiv = document.getElementById('fetchedUsers');
const imageDiv = document.getElementById('fetchedImages');
const postButton = document.getElementById('getPost');
const userButton = document.getElementById('getUser');
const imageButton = document.getElementById('getImage');
const clearButton = document.getElementById('clearAll');
const addPostButton = document.getElementById('addPost');
const successPopup = document.getElementById('successPopup');
const sourceWebsite = 'https://jsonplaceholder.typicode.com';
const navbar = document.getElementById('navbar');

/**
 * We use these to count what id we're at to fetch new information
 * Used by make url functions, clear all, make DOM element functions
 */
let postCount = 0;
let imageCount = 0;
let userCount = 0;

/**
 * The next 3 functions put together a url string (website) to search with
 * Then, they call the universal fetch function with the complete url
 * Called when a 'Get' button is pressed
 * 
 * @param website - these functions are called with sourceWebsite, which becomes website
 */
const makePostsUrl = (website) => {
  postCount++;
  website = `${website}/posts/${postCount}`;
  fetchFunction(website);
};

const makeImageUrl = (website) => {
  imageCount++;
  website = `${website}/photos/${imageCount}`;
  fetchFunction(website);
};

const makeUsersUrl = (website) => {
  userCount++;
  website = `${website}/users/${userCount}`;
  fetchFunction(website);
};

/**
 * Checks if the first child of each div of incoming data exists, then removes it
 * Sets counts to 0, so we get data from the start IDs
 * Called when 'Clear All' button is pressed
 */
const clearAll = () => {
  while (textDiv.firstChild) {
    textDiv.removeChild(textDiv.firstChild);
  }
  while (imageDiv.firstChild) {
    imageDiv.removeChild(imageDiv.firstChild);
  }
  while (usersDiv.firstChild) {
    usersDiv.removeChild(usersDiv.firstChild);
  }
  postCount = 0;
  imageCount = 0;
  userCount = 0;
};

/**
 * Fetches data, calls methods that make DOM elements based on what the URL used was
 * Called by make url functions
 * 
 * @param website - comes from the make url functions, is checked for content
 */
const fetchFunction = (website) => {
  fetch(website)
  .then((res) => {
    return res.json();
  })
  .then((data) => {
    JSON.stringify(data);
    if (website.match('posts')) {
      makePost(data);
    } else if (website.match('photos')) {
      makeImage(data);
    } else if (website.match('users')) {
      makeUser(data);
    }
  });
};

/**
 * Makes a POST request to the /posts part of the source website
 * Gives response information to a function that runs if the request was successful
 * Called when the 'Submit' button is pressed
 * 
 * @param website - URL made from sourceWebsite and /posts, in the caller function
 */
const fetchPostReq = (website) => {
  const title = document.getElementById('titleInput').value;
  const body = document.getElementById('textInput').value;

  if (title || body) {
    fetch(website, {
    method: 'POST',
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      title: title,
      body: body
    })
    })
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      JSON.stringify(data);
      postInfo = {
        id: data.id,
        title: data.title,
        body: data.body
      };
      successfulPost(postInfo);
    });
  };
};

/**
 * Builds the success popup for POST request of a post
 * Called after successful POST request response is received
 * 
 * @param postInfo - comes from the response of the POST request
 */
const successfulPost = (postInfo) => {
  if (successPopup.firstChild) {
    successPopup.removeChild(successPopup.firstChild);
  }

  const postReqDiv = document.createElement('div');
  const successMessage = document.createElement('h2');
  const postReqId = document.createElement('h3');
  const postReqTitle = document.createElement('h1');
  const postReqBody = document.createElement('p');
  const closePopup = document.createElement('h4');

  successPopup.appendChild(postReqDiv);
  postReqDiv.appendChild(successMessage);
  postReqDiv.appendChild(postReqId);
  postReqDiv.appendChild(postReqTitle);
  postReqDiv.appendChild(postReqBody);
  postReqDiv.appendChild(closePopup);

  closePopup.textContent = 'close';
  closePopup.id = 'closeButton';
  postReqDiv.id = 'successDiv'; 
  successMessage.textContent = 'Success!';
  postReqId.textContent = 'Id: ' + postInfo.id;
  postReqTitle.textContent = postInfo.title;
  postReqBody.textContent = postInfo.body;
  document.getElementById('titleInput').value = '';
  document.getElementById('textInput').value = '';

  closePopup.addEventListener('click', () => {
      postReqDiv.className = 'closed';
      setTimeout(() => {
        successPopup.removeChild(successPopup.firstChild);
      }, 680);
  });
};

/**
 * The next 3 functions build DOM elements
 * Called in their respective fetch requests
 * 
 * @param data - comes from the fetch request made
 */
const makePost = (data) => {
  if (postCount >= 100) {return};
  const postDiv = document.createElement('div');
  const postTitle = document.createElement('h2');
  const postText = document.createElement('p');
  postDiv.appendChild(postTitle);
  postDiv.appendChild(postText);
  textDiv.appendChild(postDiv);
  postText.textContent = data.body;
  postTitle.textContent = data.title;
  postDiv.id = `post#${postCount}`;
  postDiv.className = 'postDiv';
};

const makeImage = (data) => {
  if (imageCount >= 5000) {return};
  const postDiv = document.createElement('div');
  const postImage = document.createElement('img');
  const postTitle = document.createElement('h3');
  postDiv.appendChild(postImage);
  postDiv.appendChild(postTitle);
  imageDiv.appendChild(postDiv);
  postImage.src = data.url;
  postTitle.textContent = data.title;
  postDiv.id = `image#${imageCount}`;
  postDiv.className = 'imageDiv';
};

const makeUser = (data) => {
  if (userCount >= 10) {return};
  const userDiv = document.createElement('div');
  const name = document.createElement('h2');
  const username = document.createElement('h3');
  const email = document.createElement('p');
  userDiv.appendChild(name);
  userDiv.appendChild(username);
  userDiv.appendChild(email);
  usersDiv.appendChild(userDiv);
  name.textContent = data.name;
  username.textContent = data.username;
  email.textContent = data.email;
  userDiv.id = `user#${userCount}`;
  userDiv.className = 'userDiv';
};

/**
 * The next 5 functions add event listeners for click event/s happening on buttons
 */

postButton.addEventListener('click', () => {
    makePostsUrl(sourceWebsite);
  }
);

imageButton.addEventListener('click', () => {
    makeImageUrl(sourceWebsite);
  }
);

userButton.addEventListener('click', () => {
    makeUsersUrl(sourceWebsite);
  }
);

clearButton.addEventListener('click', () => {
    clearAll();
  }
);

addPostButton.addEventListener('click', () => {
    website = `${sourceWebsite}/posts`;
    fetchPostReq(website);
  }
);

/**
 * Adds a scroll event listener to the window object
 * Uses scroll position 240 to fade in the navbar and change its CSS height property
 * Below scroll position 240 we set a default inside else {}
 */
window.addEventListener('scroll', () => {
  if (window.scrollY > 240) {
    navbar.style.backgroundColor = '#00000055';
    navbar.style.height = '55px';
  } else {
    navbar.style.backgroundColor = '#f5f5f5';
    navbar.style.height = '32px';
  }
});