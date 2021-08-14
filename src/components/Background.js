import React, {useState, useEffect} from 'react';

const Background = () => {

  return <div style={{display:'flex', height:1000, 
  width: 1500,
  backgroundColor:'rgba(0,0,0,0.1)'}}>
    
    <div style={{left: 300, bottom:100, position:'absolute', width:300, height:200, backgroundColor:'white', border:'1px solid red'}}>
      <span>멘토링 친구들</span>
      <br/>
      <span>멋지게 해보자</span>
      여기에 Google Calendar Proejct의 요약 
      <br/>
      <span className="label">Next JS</span><span className="label">Redux Saga</span>
    </div>

    <div style={{left: 800, bottom:100, position:'absolute', width:300, height:200, backgroundColor:'white', border:'1px solid red'}}>
      <span>멘토링 친구들</span>
      Gmail
      <br/>
      <span className="label">Next JS</span><span className="label">Redux Saga</span>
    </div>

    <div style={{position:'absolute', bottom:0, left:0, 
    height:2,
    borderBottom:'3px solid black', width:'100%',}}></div>
  </div>
}

export default Background