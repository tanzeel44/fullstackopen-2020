import React, { useState, useEffect, useRef } from 'react';

import LoginForm from './components/LoginForm/LoginForm';
import SignOut from './components/SignOut/SignOut';
import CreateNew from './components/CreateNew/CreateNew';
import BlogList from './components/BlogList/BlogList';
import Notification from './components/Notification/Notification';
import Togglable from './components/Togglable/Togglable';
import blogService from './services/blogs';
import loginService from './services/login';
import './App.css';

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  const [notification, setNotification] = useState([null, null]);

  useEffect(() => {
    // refactored for exercise 5.9 to sort by number of likes
    blogService
      .getAll()
      .then((blogs) => blogs.sort((b1, b2) => ((b1.likes > b2.likes) ? -1 : 1)))
      .then((blogs) => setBlogs(blogs));
  }, []);

  useEffect(() => {
    const loggedInUser = JSON.parse(window.localStorage.getItem('loggedInUser'));
    if (loggedInUser) {
      setUser(loggedInUser);
      blogService.setToken(loggedInUser.token);
    }
  }, []);

  // added for 5.4
  const handleNotification = (message, type = 'success') => {
    // type defaults to success unless error is explicitly specified
    setNotification([message, type]);
    setTimeout(() => setNotification([null, null]), 4000);
  };

  // added for 5.1
  // refactored for 5.4
  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const user = await loginService.login({ username, password });
      blogService.setToken(user.token);
      setUser(user);
      setUsername('');
      setPassword('');
      window.localStorage.setItem('loggedInUser', JSON.stringify(user));
      handleNotification(
        `Successfully logged in as ${user.name}`,
      );
    } catch (error) {
      setUsername('');
      setPassword('');
      handleNotification(
        'Incorrect username or password',
        'error',
      );
    }
  };

  // refactored to include notifications for 5.4
  const handleLogout = () => {
    window.localStorage.removeItem('loggedInUser');
    setUser(null);
    blogService.setToken('');
    handleNotification(
      'Successfully logged out',
    );
  };

  // added for 5.5
  const newBlogRef = useRef();

  // refactored to include notifications for 5.4
  // updated for 5.5
  // refactored heavily for 5.16. Now takes a blog object and submits using axios
  // doesn't serve as main event handler for submit any more
  const submitNewBlog = async (blog) => {
    const { author, title, url } = blog;
    try {
      const response = await blogService.createNew({
        author,
        title,
        url,
      });
      setBlogs([...blogs, response]);
      handleNotification(
        `A new blog - ${response.title}, by ${response.author} - has been added`,
      );

      newBlogRef.current.toggleVisible();
    } catch (error) {
      handleNotification(
        'Could not add blog entry. Verify that you\'re logged in and all fields are filled out!',
        'error',
      );
      newBlogRef.current.toggleVisible();
    }
  };

  // added for 5.15
  const addLike = async (id, likes) => {
    await blogService.addLike(id, {
      likes: likes + 1,
    });
  };

  // added for 5.2
  // refactored for 5.5
  // BlogList modified for 5.15 to include addLike prop
  const loggedInDisplay = () => (
    <div>
      <SignOut user={user} signOut={handleLogout} />
      <Togglable buttonText="New Entry" ref={newBlogRef}>
        <CreateNew
          submitBlog={submitNewBlog}
        />
      </Togglable>
      <BlogList addLike={addLike} blogs={blogs} />
    </div>
  );

  // refactored to include notifications for 5.4
  return (
    <div className="App">
      {notification[0]
        ? <Notification message={notification[0]} type={notification[1]} />
        : null}
      {user === null
        ? (
          <LoginForm
            handleSubmit={handleLogin}
            username={username}
            setUsername={setUsername}
            password={password}
            setPassword={setPassword}
          />
        )
        : loggedInDisplay()}
    </div>
  );
};

export default App;
