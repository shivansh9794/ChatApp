import React from 'react'

const chat = ({socket , message, room }) => {
  return (
    <div>
        <div>
            <div className='chat_header'></div>
            <div className='chat_body'></div>
            <div className='chat_footer'></div>
        </div>
    </div>
  )
}

export default chat