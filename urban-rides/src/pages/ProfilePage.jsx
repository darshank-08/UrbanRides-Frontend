import React from 'react'
import styles from "./ProfilePage.module.css"
import ProfileCard from '../components/ProfileCard'

const ProfilePage = () => {
  return (
    <div className={styles.profilePage}>
        <h2 className={styles.profileTitle}>My Profile</h2>
        <ProfileCard />
    </div>
  )
}

export default ProfilePage