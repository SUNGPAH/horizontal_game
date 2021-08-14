import React, {useEffect, useState} from 'react';
import Enemy from './Enemy';
import { useDispatch, useSelector } from 'react-redux';

const Map = ({objs}) => {
  const dispatch = useDispatch();
  const enemies = useSelector(state => state.enemy.enemies);
  const [_enemies, _setEnemies] = useState([]);
    
  useEffect(() => {
    _setEnemies(enemies)
  }, [enemies])
  
  return <div style={{display:'flex', height:1000, 
  width: 1500,
  backgroundColor:'rgba(0,0,0,0.1)'}}>
    {
      objs.map((el, index) => {
        return <div style={{
          width: el.xAxis[1] - el.xAxis[0], 
          height: el.height, backgroundColor:el.backgroundColor,
          left: el.xAxis[0], 
          bottom: el.yPos,
          position:'absolute',
        }}></div>
      })
    }
    

    {
      _enemies.map((enemy, index) => {
        return <Enemy enemy={enemy}/>
      })
    }

    <div style={{position:'absolute', bottom:0, left:0, 
    height:2,
    borderBottom:'3px solid black', width:'100%',}}></div>


  </div>
}

export default Map