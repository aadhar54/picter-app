import React, { useEffect, useContext, useState } from 'react'
import Axios from 'axios'
import { v1 as genId } from 'uuid'

import Navbar from '../../components/Navbar'
import Newpost from '../../components/Newpost'
import Post from '../../components/Post'
import './style.css'
import { BASE_URL } from '../../config'

import { Context as NotificationContext } from '../../context/NotificationContext'
import { Context as PostContext } from '../../context/PostContext'
import { ADD_NOTI, SET_POSTS } from '../../context/actionTypes'

export default (props) => {
  // Notification context
  const { setNotification } = useContext(NotificationContext)
  // Post context
  const { posts, setPost } = useContext(PostContext)
  // State to store id of last post
  const [currentId, setCurrentId] = useState(0)

  // Load all posts
  useEffect(() => {
    const getPosts = async () => {
      const loggedUserId = 1
      try {
        const result = await Axios({
          method: 'POST',
          url: `${BASE_URL}/post/${loggedUserId}`,
          headers: {
            'Content-Type': 'application/json'
          },
          data: {
            current: currentId
          }
        })
        setPost({
          action: SET_POSTS,
          data: result.data
        })
      } catch (err) {
        setNotification({
          action: ADD_NOTI,
          data: {
            id: genId(),
            message: 'There was an error while loading posts. Please try again later',
            type: 'error',
            color: 'red'
          }
        })
      }
    }
    getPosts()
  }, [currentId])
  return (
    <div>
      <Navbar />
      <div className='container'>
        <div className='main-contents'>
          <div className='contents'>
            <Newpost />
            {!posts.posts.ids.length ? (
              <p class='muted-text'>No posts to show</p>
            ) : (
              posts.posts.ids.map((id) => <Post key={id} postId={id} />)
            )}
          </div>
          <div className='sidebar'>
            <h1>sidebar</h1>
          </div>
        </div>
      </div>
    </div>
  )
}