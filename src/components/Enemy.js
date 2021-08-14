import React, {useEffect, useState} from 'react';
import { useSelector, useDispatch} from 'react-redux';
import { setGameStatus } from '../reducers/user';

const Enemy = ({enemy}) => {
  const dispatch = useDispatch();
  const {posX, posY, playerWidth} = useSelector(state => state.user)

  const [enemyPosX, setEnemyPosX] = useState(enemy.xAxis[0])
  const [enemyPosY, setEnemyPosY] = useState(enemy.yPos)
  const width = enemy.xAxis[1] - enemy.xAxis[0]
  const height = enemy.height
  const movable = enemy.movable
  const [_interval, _setInteval] = useState(null);
  
  useEffect(() => {
    return 
    if(movable){
      if(enemy.orientation === "right"){
        let interval = setInterval(() => {
          setEnemyPosX(prev => prev + 4)
        }, 100)
        _setInteval(interval);
      }else{
        //then here!
      }
    }
  }, [])

  useEffect(() => {

    const Xdistance = Math.abs(enemyPosX - posX)

    if(Xdistance <= playerWidth/2 + width/2){
      if(isOverlapping([posY, posY + 40],[enemyPosY, enemyPosY + height - 1])){
        dispatch(setGameStatus("die"));
        clearInterval(_interval);
      }
    }

    if(enemyPosY + height === posY && isOverlapping([posX - playerWidth/2, posX + playerWidth/2],[enemyPosX + 1, enemyPosX + width])){
      dispatch(setGameStatus("die"));
      clearInterval(_interval);
    }

  }, [posX, posY, enemyPosX])

  const isOverlapping = ([a, b], [c, d]) => {
    if (b >= c && b <= d) {
      return true;
    }

    if (a >= c && a <= d) {
      return true;
    }

    if (a <= c && d <= b) {
      return true;
    }

    return false;
  };
  
  
  return <div style={{
    width: enemy.xAxis[1] - enemy.xAxis[0],
    height: enemy.height, 
    backgroundColor: enemy.backgroundColor, 
    left: enemyPosX, 
    bottom: enemyPosY, 
    position:"absolute"}}></div>
}

export default Enemy