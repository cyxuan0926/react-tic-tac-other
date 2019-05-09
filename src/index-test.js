import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
// JSX <div/>:React.createElement('div') state
// 在js class中，每次你定义其子类的构造函数时，都需要调用super方法，因此在所有含有
// 构造函数的React组件中，构造函数必须以super(props)开头
// 函数组件：只有一个render方法,并且不包含state 接收props作为参数，然后返回需要渲染的元素
// 本质就是3x3的矩阵 点击后填充字符'X' 或者'O' 
// 每一个网格 asdad 
function Square(props) {
  return (
    <button 
      className="square"
      onClick={props.onClick}>
      {props.value}
    </button>
  );
}
// class Square extends React.Component {
//   render() {
//     return (
//       <button 
//         className="square"
//         onClick={() =>{ this.props.onClick() }}>
//         {this.props.value}
//       </button>
//     );
//   }
// }
// 整个矩阵
class Board extends React.Component {
  // handleClick(i) {
  //   // state.squares数组的一个副本
  //   // 一般来说，有两种改变数据的方式。第一种方式是直接修改变量的值
  //   // 第二种是使用新的一份数据替换旧数据
  //   // 好处：简化复杂的功能
  //   const squares = this.state.squares.slice();
  //   if(calculateWinner(squares) || squares[i]) return;
  //   squares[i] = this.state.xIsNext ? 'X' :'O'; 
  //   this.setState({
  //     squares, 
  //     xIsNext: !this.state.xIsNext
  //   });
  // }
  renderSquare(i) {
    return <Square 
              value={this.props.squares[i]}
              onClick={() => {this.props.onClick(i)}}/>;
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}
// 整个布局
class Game extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      history: [{
        squares: Array(9).fill(null)
      }],
      xIsNext: true,
      stepNumber: 0, //当前正在查看哪一项历史纪录
    }
  }
  handleClick(i) {
    // 点击一下 要保存上一步的内容
    // 行号 列号(2,3)
    const history = this.state.history.slice(0, this.state.stepNumber+1); // 历史内容
    const current = history[history.length - 1]; // 当前这一步
    const squares = current.squares.slice(); // 当前这一步的数组
    if(calculateWinner(squares) || squares[i]) return;
    squares[i] = this.state.xIsNext ? 'X' : 'O'; 
    this.setState({
      history: history.concat([{squares}]), // 更新历史内容
      xIsNext: !this.state.xIsNext, // 变更下一个出现的符号 
      stepNumber: history.length, // 当前步数同步变化
    })
  }
  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    })
  }
  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    const moves = history.map((step,move)=>{
      const desc = move ? 'Go to move #' + move : 'Go to game start';
      return (
        <li key={move}>
          <button onClick={()=>{this.jumpTo(move)}}>{desc}</button>
        </li>
      )
    });
    let status = winner ? 'Winner: ' + winner : 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    return (
      <div className="game">
        <div className="game-board">
          <Board 
            squares={current.squares}
            onClick={(i)=> this.handleClick(i)}/>
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}
// 判断出胜者：就是这几种情况下就会有胜者
function calculateWinner(squares) {
  const lines = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6]
  ]
  for(let i = 0;i<lines.length;i++) {
    const [a,b,c]= lines[i]
    if(squares[a] && squares[a]===squares[b] && squares[a]===squares[c]) {
      return squares[a];
    }
  }
  return null;
}
// 在游戏历史记录列表显示每一步棋的坐标，格式为 (列号, 行号):在不改变项目数据结构的情况下
// function judgeCoordinates() {
//   const values = []
// } 
// ========================================
// react是一个声明式，高效且灵活的用于构建用户界面的js库
// ReactDOM.render(
//   <Game />,
//   document.getElementById('root')
// );