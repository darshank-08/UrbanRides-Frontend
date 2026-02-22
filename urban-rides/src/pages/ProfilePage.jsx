import React from 'react'
import styles from "./profilePage.module.css.module.css"
import ProfileCard from '../components/ProfileCard'

const ProfilePage = () => {
  return (
    <div className={styles.profilePage}>
        <ProfileCard />
    </div>
  )
}

export default ProfilePage