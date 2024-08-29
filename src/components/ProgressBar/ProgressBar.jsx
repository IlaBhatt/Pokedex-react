import React from 'react'

const ProgressBar = ({progress}) => {
    const styles = {
        width: `${progress}%`,
        height: '100%',
        backgroundColor: 'blue',
        transition: 'width 0.5s ease-in-out',
    }
  return (
    <div className='progress-bar'>
        <div style={styles}></div>
    </div>
  )
}

export default ProgressBar;