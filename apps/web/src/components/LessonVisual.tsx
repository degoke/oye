import type { LessonContent } from '@oye/shared';
import styles from './LessonVisual.module.css';

export function LessonVisual({ visual }: { visual: LessonContent['visual'] }) {
  return <figure className={styles.visual} aria-label={visual.title}>
    <figcaption className={styles.caption}>{visual.title}</figcaption>
    <ol className={`${styles.items} ${visual.type === 'comparison' ? styles.comparison : ''}`}>
      {visual.items.map((item, index) => <li key={index} className={styles.item}><div className={styles.label}>{visual.type !== 'comparison' && <span className={styles.number}>{index + 1}</span>}{item.label}</div><p className={styles.detail}>{item.detail}</p></li>)}
    </ol>
  </figure>;
}
