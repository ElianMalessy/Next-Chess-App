import classes from './board.module.css';
import useWindowDimensions from '../hooks/useWindowDimensions';

export default function Piece({
  piece,
  color,
  column,
  row,
}: {
  piece: string;
  color: string;
  column: number;
  row: number;
}) {
  const {width} = useWindowDimensions();
  const scale = 64 > width / 8 ? width / 8 : 64;
  const styles = [scale * column, scale * row];
  if (piece === 'k') return <King color={color} styles={styles} />;
  else if (piece === 'q') return <Queen color={color} styles={styles} />;
  else if (piece === 'r') return <Rook color={color} styles={styles} />;
  else if (piece === 'b') return <Bishop color={color} styles={styles} />;
  else if (piece === 'n') return <Knight color={color} styles={styles} />;
  else if (piece === 'p') return <Pawn color={color} styles={styles} />;
}

function King({color, styles}: {color: string; styles: number[]}) {
  return <div className={classes[`k_${color}`]} style={{transform: `translate(${styles[0]}px, ${styles[1]}px)`}} />;
}
function Queen({color, styles}: {color: string; styles: number[]}) {
  return <div className={classes[`q_${color}`]} style={{transform: `translate(${styles[0]}px, ${styles[1]}px)`}} />;
}
function Rook({color, styles}: {color: string; styles: number[]}) {
  return <div className={classes[`r_${color}`]} style={{transform: `translate(${styles[0]}px, ${styles[1]}px)`}} />;
}
function Bishop({color, styles}: {color: string; styles: number[]}) {
  return <div className={classes[`b_${color}`]} style={{transform: `translate(${styles[0]}px, ${styles[1]}px)`}} />;
}
function Knight({color, styles}: {color: string; styles: number[]}) {
  return <div className={classes[`n_${color}`]} style={{transform: `translate(${styles[0]}px, ${styles[1]}px)`}} />;
}
function Pawn({color, styles}: {color: string; styles: number[]}) {
  return <div className={classes[`p_${color}`]} style={{transform: `translate(${styles[0]}px, ${styles[1]}px)`}} />;
}
