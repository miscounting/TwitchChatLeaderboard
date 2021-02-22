import { render } from 'react-dom'
import React, { useState, useEffect, useReducer } from 'react'
import { useTransition, animated } from 'react-spring'
import shuffle from 'lodash/shuffle'
import data from './data'
import './styles.css'
import ComfyJS from 'comfy.js';

ComfyJS.Init('miscounting');

function Shuffle() {

  function reducer(oldState, chatter) {
    var isNewChatter = true;
    var myState = new Array(...oldState);
    console.log(chatter.username + ": " + chatter.message);
    myState.forEach(row => {
      if (chatter.username === row.name) {
        row.count++;
        isNewChatter = false;
        return;
      }
    });
    if (isNewChatter) {
      console.log(chatter.username + " is a new chatter");
      myState.push({
        name: chatter.username,
        description: '#a8edea → #fed6e3',
        css: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
        height: 150,
        text: chatter.message,
        count: 1
      })
      // add the row
    }
    myState.sort((a,b) => b.count - a.count);
    return myState;
  }
  
  const [rows, set] = useState(data);

  function addChat(user, message) {
    console.log("old rows: ", rows);
    set(prevState => reducer(prevState, {username: user, message: message}));
  }

  let newUserCount = 1;

  useEffect(() => void setInterval(
    () => {
      var index = Math.floor(Math.random() * rows.length);
      addChat(rows[index].name, "I am chatting");
    }, 2000
    ), [rows]);
    useEffect(() => void setInterval(
      () => {
        
        addChat("new user " + newUserCount++ , "I am a new chatter");
      }, 500
      ), [rows, newUserCount]);

  useEffect(() => {
    

    ComfyJS.onChat = (user, message) => {
      addChat(user,message);
    };
  });
  // useEffect(() => void setInterval(() => set(shuffle), 2000), [])

  let height = 0;
  let currentHeight = 0;
  const transitions = useTransition(
    rows.map(theState => ({ ...theState, y: (height += theState.height) - theState.height })),
    d => d.name,
    {
      from: { height: 0, opacity: 0 },
      leave: { height: 0, opacity: 0 },
      enter: ({ y, height }) => ({ y, height, opacity: 1 }),
      update: ({ y, height }) => ({ y, height })
    }
  )

  return (
    <div className="list" >
      {transitions.map(({ item, props: { y, ...rest }, key }, index) => (
        <animated.div
          key={key}
          className="card"
          style={{ zIndex: rows.length - index, transform: y.interpolate(y => `translate3d(0,${y}px,0)`), ...rest }}>
          <div className="cell">
            <div className ="details" style={{ backgroundImage: item.css }}>
              <h1>{item.name}</h1>
              <p>{item.count}</p>
            </div>
          </div>
        </animated.div>
      ))}
    </div>
  )
}

export default Shuffle;
