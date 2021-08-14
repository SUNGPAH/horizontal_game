import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'

import React, {useState, useEffect} from 'react';
import _ from 'lodash';
import Map from '../src/components/Map';
import Background from '../src/components/Background';
import { useDispatch, useSelector } from "react-redux";
import { setPosX, setPosY, setGameStatus } from "../src/reducers/user";
import {setEnemies} from '../src/reducers/enemy';
import {isOverlapping} from '../src/helperFunctions';

function App() {
  const dispatch = useDispatch();
  const {posX, posY, gameStatus, playerWidth, playerHeight} = useSelector(state => state.user);

  const [yMomentum, setYMomentum] = useState(null);
  const [xMomentum, setXMomentum] = useState('right');
  const [jumpTrigger, setJumpTrigger] = useState(null);
  const [jumpState, setJumpState] = useState(null); //start(trigger), on, end
  const [xCmd, setXCmd] = useState(null);
  const [xPositionTrigger, setXPositionTrigger] = useState(null);
  const [yPositionTrigger, setYPositionTrigger] = useState(null);
  const jumpUnit = 8 //
  const horizontalUnit = 8
  const jumpFrame = 5 //10 ms.
  const jumpCnt = 32

  const [xInterval, setXInteval] = useState(null);
  let _xInterval
  const [upInterval, setUpInterval] = useState(null);
  const [downInterval, setDownInterval] = useState(null);
  let _downInterval
  const [superMode, setSuperMode] = useState(false);

  const objs = [
    {
      xAxis: [32,48],
      yPos: 40,
      height:40,
      backgroundColor: 'yellow',
    },
    {
      xAxis: [200,280],
      yPos: 0,
      height:40,
      backgroundColor: 'yellow',
    },
    {
      xAxis: [600,650],
      yPos: 96,
      height:40,
      backgroundColor: 'green',
    },
    {
      xAxis: [800,880],
      yPos: 40,
      height:40,
      backgroundColor: 'green',
    },
  ]

  const enemies = [
    {
      objType: "enemy",
      movable: true,
      orientation: "right",
      xAxis: [56, 64],
      yPos: 0,
      height: 20,
      backgroundColor: "black",
    },
    {
      objType: "enemy",
      xAxis: [80, 88],
      yPos: 0,
      height: 36,
      backgroundColor: "black",
    },
  ];
  useEffect(() => {

    dispatch(setEnemies(enemies))
    dispatch(setGameStatus('start'))
  }, [])

  useEffect(() => {
    const handleDown = event => {
      if(event.code === "Space"){
        jump()
      }

      if(event.code === "ArrowRight"){
        event.preventDefault()
        setXCmd('right');
      }

      if(event.code === "ArrowLeft"){
        event.preventDefault()
        setXCmd('left');
      }
    }

    const handleUp = event => {
      if(event.code === "ArrowRight"){
        event.preventDefault();
        setXCmd(null);
      }
      if(event.code === "ArrowLeft"){
        event.preventDefault();
        setXCmd(null);
      }
    }

    window.addEventListener("keyup", handleUp)
    window.addEventListener("keydown", handleDown)

    return () => {
      window.removeEventListener("keyup", handleUp)
      window.removeEventListener("keydown", handleDown)
    }
  }, [])

  useEffect(() => {
    if(xInterval){
      clearInterval(xInterval)
    }

    if(xCmd === 'right'){
      _xInterval = setInterval(() => {
        right()
      }, 20)
      setXInteval(_xInterval)

    }else if(xCmd === 'left'){
      _xInterval = setInterval(() => {
        left()
      }, 20)
      setXInteval(_xInterval)
    }else{

    }

  }, [xCmd])

  useEffect(() => {
    //근데, 이미 jumpstate가 start인 경우에는, 어짜피 계속 인풋이 들어와도 똑같음. 반응 안함.
    if (jumpState === "start"){
      //trigger가 되면..
      // console.log("trigger position");
      triggerYPosition();
    }
    if (jumpState === "end") {
      // console.log('clear interval');
      clearInterval(downInterval);
      setYMomentum(null);
    }
  }, [jumpState])


  //jump cmd -> jumpstate start, yMomentum up
  //jumpState가 이미 스타트 인 겨우
  //listner.
  //여기서는 state들이 모두 동일함. 따라서.. 
  const jump = () => {
    setJumpTrigger(Math.random());
  }

  useEffect(() => {
    //jump command
    if(!jumpTrigger){
      return
    }

    if(jumpState === "start" || jumpState === "on") {
      //no further update
      console.log('ss');
    }else if (jumpState === "end"){
      //update momentum
      setJumpState('start')
    }else if( jumpState === "on"){
      console.log('on?')
    }else {
      console.log('initially');
      console.log(jumpState);
      setJumpState('start')

    }

  }, [jumpTrigger])

  //enter design 전에.. 맵을 어떻게 할지 생각해보자.

  const left = async () => {
    //find object.
    //crash check.
    //then move.
    // await new Promise(r => setTimeout(r, xFrame));
    setXPositionTrigger(`left_${Math.random()}`)

  }

  const right = async () => {
    // await new Promise(r => setTimeout(r, xFrame));
    setXPositionTrigger(`right_${Math.random()}`)
  }

  //move command -> update momentum -> {find objects -> define crash -> then update location}
  const triggerYPosition = async () => {
    setYMomentum("up")
  }

  const reset = () => {
    setYMomentum(null)
    setXMomentum('right')
    setJumpState(null)
    setXCmd(null)
    dispatch(setPosX(0));
    dispatch(setPosY(0));
    dispatch(setGameStatus("start"));
    dispatch(setEnemies(enemies));//rerendering.. how to do that..?
    //이것만 셋을 하면 될일이 아닌가..? 
  }

  useEffect(() => {
    if(yMomentum === "down"){
      
      _downInterval = setInterval(() => {
        setYPositionTrigger(`down_${Math.random()}`)
      }, 10)

      setDownInterval(_downInterval)

      //keep falling down until, meet something.

    }else if(yMomentum === "up"){
      //여기서 몇번의 카운트를 한 후에, 그다음엔 자동 종료.
      let cnt = 0
      let upCntCeiling = superMode ? jumpCnt * 2 : jumpCnt
      
      const interval = setInterval(() => {
        setYPositionTrigger(`up_${Math.random()}`)
        cnt++
        if (cnt === upCntCeiling){
          clearInterval(interval)
          setYMomentum('down');
        }

      }, jumpFrame)
      setUpInterval(interval)
    }
  }, [yMomentum])

  useEffect(() => {
    if(yPositionTrigger){
      if(yPositionTrigger.split("_")[0] === "up"){
        dispatch(setPosY(posY + jumpUnit))
      }else{
        //here + 1 pixel!
        if(posY === 0){
          // alert('s');
          setJumpState("end");
          return
        }

        let block = objs.find(obj => (obj.yPos + obj.height === posY) && isOverlapping([posX - playerWidth/2, posX + playerWidth/2], [obj.xAxis[0] + 1, obj.xAxis[1]]))

        if(block){
          console.log('block exist');
          setJumpState("end");
          if(block.objType === "enemy"){
            console.log('enemy');
          }
          
        }else{
          dispatch(setPosY(posY - jumpUnit));
        }
      }
    }
    setYPositionTrigger(null);
  }, [yPositionTrigger])

  useEffect(() => { 
    if(xPositionTrigger) {
      // alert('asdf');
      let _xMomentum = xPositionTrigger.split("_")[0]

      console.log(_xMomentum);
      if(_xMomentum === "left"){    
        //find object..
        //check crash
        //if ok, then move.
        let block = objs.find(obj => (obj.xAxis[1] === (posX - playerWidth/2) && isOverlapping([posY, posY + 40], [obj.yPos, obj.yPos + obj.height - 1])))
        if(block){
        
        }else{
          dispatch(setPosX(posX - horizontalUnit))
        }
      }else{
        //막히는 경우.
        //여기가 제일 헤비 하겠군..
        // let block = objs.find(obj => (obj.xAxis[0] === (posX + 20)))
        let block = objs.find(obj => (obj.xAxis[0] === (posX + playerWidth/2) && isOverlapping([posY, posY + 40], [obj.yPos, obj.yPos + obj.height])))
        if(block){
        }else{
          
          dispatch(setPosX(posX + horizontalUnit))
        }
      }   
      setXMomentum(_xMomentum)
    }

    setXPositionTrigger(null);
  }, [xPositionTrigger])

  useEffect(() => {
    //여기서 무언가 판단을 해서..그다음 옵젝을 발견해서, 문제가 없다면.. 그냥 두기. 
    if(posY === 0 && jumpState === "start"){
      // alert('s');
      setJumpState("end");
    }

    let block = objs.find(obj => (obj.yPos + obj.height === posY) && isOverlapping([posX - playerWidth/2, posX + playerWidth/2 ], [obj.xAxis[0] + 1, obj.xAxis[1]]))
    if(block){
      if(yMomentum === "down"){
        setJumpState("end")
        return
      }
    }

    let crashedBlock = objs.find(obj => (obj.yPos === (posY + playerHeight)) && isOverlapping([posX - playerWidth/2, posX + playerWidth/2 ], [obj.xAxis[0] + 1, obj.xAxis[1]]))
    if(crashedBlock && yMomentum === "up"){

      clearInterval(upInterval);
      setJumpState("on"); 
      setYMomentum("down");      
    }

  }, [posY])

  useEffect(() => {
    //조건이 충족 되어 움직이고 나면, 언스테이블 한 상태가 되는지를 체크 하자.
    if(jumpState === "end"){
      if(posY > 0){
        //unstable
        let block = objs.find(obj => (obj.yPos + obj.height === posY) && isOverlapping([posX - playerWidth/2, posX + playerWidth/2 ], [obj.xAxis[0], obj.xAxis[1]]))
        if(block){
          //keep
        }else{
          // alert('unstable');
          setJumpState("on");
          setYMomentum('down');
        }
      }
    }    
  }, [posX])

  useEffect(() => {
    if (gameStatus === "die") {
      alert("die");
      reset();

    }
  }, [gameStatus])

  return (
    <div className="App">
      <div style={{ position: "absolute", zIndex: 2 }}>
        posX: {posX}, posY: {posY} | x momentum {xMomentum} | y momeuntum {yMomentum}
        <div onClick={left}>left</div>
        <div onClick={right}>right</div>
        <div onClick={(e) => setSuperMode((prev) => !prev)}>
          SuperMode {superMode && <div>on</div>}
        </div>
        <div onClick={reset}>reset</div>
      </div>

      {/* top container ->  */}
      <div
        style={{
          position: "absolute",
          left: 100,
          width: 600,
          border: "2px solid blue",
          height: 500,
          bottom: 200,
        }}
      >
        <div style={{ position: "absolute", left: -posX + 300, bottom: -posY }}>
          {gameStatus === "start" && <Map objs={objs} />}
          <Background />
        </div>
        <div
          style={{
            position: "absolute",
            left: "50%",
            transform: "translate(-50%)",
            bottom: 0,
            width: playerWidth,
            height: playerHeight,
            backgroundColor: "pink",
          }}
        >
          Player
        </div>
      </div>
    </div>
  );
}

export default App;
