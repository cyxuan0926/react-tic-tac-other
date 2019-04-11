import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
// 添加一个可以升序或降序显示历史纪录的按钮
// 当无人获胜时 显示一个平局 先判断当前是否获胜 再判断下一步是否什么符号 然后再接下来的ji
function Square(props) {
  return(
    <button
      style={(props.winnerArr && props.winnerArr.includes(props.index)) ? {background: '#ffb7b7'} : {} } 
      className="square"
      onClick={() => props.onClick()}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return <Square
              key = {i}
              index={i}
              winnerArr={this.props.winnerArr} 
              value={this.props.squares[i]}
              onClick={()=>this.props.onClick(i)}/>;
  }
  // 一个是9个元素 3X3 的排列
  render() {
    let temp = [], finaly;
    this.props.squares.map((value, index) => {
      let arr = this.renderSquare(index);
      if( index % 3 === 0) {
        temp.push([]);
      }
      temp[parseInt(index/3)].push(arr);
      return arr;
    });
    finaly = temp.map((value,index) => {
      return (
        <div key={index}>
          {value}
        </div>
      );
    });
    return (
      <div>
        {finaly}
      </div>
    );
  }
}
// 历史纪录：每走一步就保存当前步的数组信息，回到某一步就是取出当前步的数组
class Game extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      history: [{
          squares: Array(9).fill(null), // 步数的历史内容
          coordinates: Array(2).fill(null) // 坐标历史
      }],
      stepNumber: 0, // 当前步数
      xIsNext: true, // 下一步是'X'还是'O'
      ascendingOrder: true
    }
  }
  handleClick(i) {
    // 这是点击小方格 需要改变的是历史数据数组 下一步出现的元素 步数
    const history = this.state.history.slice(0, this.state.stepNumber+1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if(calculateWinner(squares) || squares[i]) return;
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    const coordinates = judgeCoordinates(i);
    this.setState({
      xIsNext: !this.state.xIsNext,
      history: history.concat([{squares,coordinates}]),
      stepNumber: history.length,
    })
  }
  jumpTo(step) {
    // 这是跳转到第几步 需要改变的就是第几步 判断下一步出现的元素是什么
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0
    });
  }
  handleSort() {
    if(this.state.history.length === 1) return
    this.setState({
      ascendingOrder: !this.state.ascendingOrder
    });
  }
  render() {
    // 升序 降序：历史数组 倒序过来
    // 现在的步数 倒序过来后 需要改变不
    // 渲染函数 当数据发生变化的时候 重新渲染改变的部分 当前就是stepNumber style={weightStyle}
    // 几个重点关注得东西 第一个现在是第几步 下一步是什么东西,现在得历史纪录数组, 现在得历史坐标数组
    let ascendingOrder = this.state.ascendingOrder;
    const history = ascendingOrder ? this.state.history.slice() : (this.state.history.slice().reverse());
    let tsNumber = ascendingOrder ? this.state.stepNumber : history.length - this.state.stepNumber - 1;
    const weightStyle = {fontWeight:'bolder'};
    const current = history[tsNumber];
    const winnerArr = calculateWinner(current.squares);
    let moves = history.map((value, index) => {
      let ts = ascendingOrder ? index : history.length -index -1;
      let desc = ts ? `Go to move # ${ts} (${value.coordinates[0]},${value.coordinates[1]})` : 'Go to game start'
      return (
        <li key={ts}>
          <button 
            onClick={() => this.jumpTo(ts)}
            style={(history.length !== 1 && ts === this.state.stepNumber) ? weightStyle : {}}>
              {desc}
          </button>
        </li>
      );
    });
    let status = winnerArr ? (winnerArr.length ? `Winner: ${current.squares[winnerArr[0]]}` : '平局') : 'Next player: '+ (this.state.xIsNext ? 'X' : 'O');
    return (
      <div className="game">
        <div className="game-board">
          <Board
            winnerArr={winnerArr} 
            onClick={(i) => this.handleClick(i)}
            squares={current.squares}/>
        </div>
        <div className="game-info">
          <div>
            {status}
            <button 
              style={{marginLeft: 10+'px'}}
              onClick={() => this.handleSort()}>
                {ascendingOrder ? '降序': '升序'}
            </button>
          </div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}
function calculateWinner(squares) {
  // 获胜情况下的数组 只要这些数组里面有两个不同的情况 那就会产生平局
  // 提前判断 三个数组剩下的时候 也是可能平局的 
  let tempResultArr = [];
  for(let [tempIndex, tempValue] of squares.entries()) {
    if(!tempValue) tempResultArr.push(tempIndex);
  }
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],  
    [0, 3, 6],  
    [1, 4, 7],  
    [2, 5, 8],  
    [0, 4, 8],
    [2, 4, 6] 
  ]
  for(let index in lines) {
    const [a, b, c] = lines[index];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) return [a, b, c];
  }
  if(tempResultArr.length <= 3) {
    let temp = 0;
    for(let indexs in tempResultArr) {    
      for(let index in lines) {
        const [a, b, c] = lines[index];
        if([a, b, c].includes(tempResultArr[indexs])) {
          let copy = [a, b, c].slice();
          copy.splice([a,b,c].indexOf(tempResultArr[indexs]),1);
          if(squares[copy[0]] && squares[copy[0]] && squares[copy[0]]!== squares[copy[1]]) {
           temp = 0;
          } else {
            temp = temp + 1;
            break;
          }
        }
      } 
      if(temp) break;
    }
    if(!temp) {
      return [];
    }
  }
  return null;
}
function judgeCoordinates(index) {
  let result = []
  switch (index) {
    case 0:
      result = [0, 0];
      break;
    case 1:
      result = [0, 1];
      break;
    case 2:
      result = [0, 2];
      break;
    case 3:
      result = [1, 0];
      break;
    case 4:
      result = [1, 1];
      break;
    case 5:
      result = [1, 2];
      break;
    case 6:
      result = [2, 0];
      break;
    case 7:
      result = [2, 1];
      break;
    case 8:
      result = [2, 2];
      break;      
    default:
      result = [];
  }
  return result;   
}
// ========================================
ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
