import classes from './board.module.css';

export default function Piece({piece, color, styles}: {piece: string; color: string; styles: number[]}) {
  if (piece === 'k') return <King color={color} styles={styles} />;
  else if (piece === 'q') return <Queen color={color} styles={styles} />;
  else if (piece === 'r') return <Rook color={color} styles={styles} />;
  else if (piece === 'b') return <Bishop color={color} styles={styles} />;
  else if (piece === 'n') return <Knight color={color} styles={styles} />;
  else if (piece === 'p') return <Pawn color={color} styles={styles} />;
}

function King({color, styles}: {color: string; styles: number[]}) {
  return <div className={classes[`k_${color}`]} style={{top: styles[0], left: styles[1]}} />;
}
function Queen({color, styles}: {color: string; styles: number[]}) {
  return <div className={classes[`q_${color}`]} style={{top: styles[0], left: styles[1]}} />;
}
function Rook({color, styles}: {color: string; styles: number[]}) {
  return <div className={classes[`r_${color}`]} style={{top: styles[0], left: styles[1]}} />;
}
function Bishop({color, styles}: {color: string; styles: number[]}) {
  return <div className={classes[`b_${color}`]} style={{top: styles[0], left: styles[1]}} />;
}
function Knight({color, styles}: {color: string; styles: number[]}) {
  return <div className={classes[`n_${color}`]} style={{top: styles[0], left: styles[1]}} />;
}
function Pawn({color, styles}: {color: string; styles: number[]}) {
  return <div className={classes[`p_${color}`]} style={{top: styles[0], left: styles[1]}} />;
}
