"use client";

import {useEffect,useRef} from "react";
import {motion} from "motion/react";
import {ArrowUpRight,ChevronLeft,ChevronRight} from "lucide-react";
import {dateKey} from "@/lib/planner.mjs";

type Props={today:Date;onWeek:()=>void;onCalendar:(date:string)=>void};

const spring={type:"spring" as const,stiffness:360,damping:30,mass:.75};

export default function HomeDashboard(props:Props){
  const {today}=props;
  const todayKey=dateKey(today);
  const dateTrack=useRef<HTMLDivElement>(null);
  const anchor=useRef<HTMLButtonElement>(null);
  const dates=Array.from({length:121},(_,index)=>{
    const date=new Date(today.getFullYear(),today.getMonth(),today.getDate()+index-30,12);
    return {date,key:dateKey(date)};
  });
  useEffect(()=>{anchor.current?.scrollIntoView({block:"nearest",inline:"center"});},[todayKey]);

  return <motion.div className="premium-home" initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{duration:.5,ease:[.22,1,.36,1]}}>
    <section className="home-week" aria-label="Navegação por datas">
      <div className="home-section-label"><div><small>SEU TEMPO, NO SEU RITMO</small><span>{today.toLocaleDateString("pt-BR",{weekday:"long",day:"numeric",month:"long"})}</span></div><button onClick={props.onWeek}>Planejar semana <ArrowUpRight size={14}/></button></div>
      <div className="home-date-window"><button className="home-date-arrow" aria-label="Voltar nas datas" onClick={()=>dateTrack.current?.scrollBy({left:-455,behavior:"smooth"})}><ChevronLeft size={18}/></button><div className="home-date-rail" ref={dateTrack}>
        {dates.map(({date,key})=>{const current=key===todayKey;return <motion.button key={key} ref={current?anchor:undefined} className={current?"is-today":""} whileHover={{y:-3}} whileTap={{scale:.96}} transition={spring} aria-label={"Abrir "+date.toLocaleDateString("pt-BR",{weekday:"long",day:"numeric",month:"long",year:"numeric"})} aria-current={current?"date":undefined} onClick={()=>props.onCalendar(key)}><small>{date.toLocaleDateString("pt-BR",{weekday:"short"}).replace(".","")}</small><strong>{date.getDate()}</strong><i/></motion.button>})}
      </div><button className="home-date-arrow" aria-label="Avançar nas datas" onClick={()=>dateTrack.current?.scrollBy({left:455,behavior:"smooth"})}><ChevronRight size={18}/></button></div>
    </section>

    <motion.section className="home-watercolor" initial={{opacity:0,scale:.985}} animate={{opacity:1,scale:1}} transition={{duration:.8,ease:[.22,1,.36,1]}} aria-label="Uma pausa para seguir no seu ritmo">
      <div className="home-watercolor-copy"><span>HEADER · PLANEJAMENTO PESSOAL</span><h2>Um passo de cada vez.</h2><p>Organize sua semana, cuide dos seus hábitos e reserve espaço para o que importa.</p><button onClick={props.onWeek}>Abrir minha semana <ArrowUpRight size={15}/></button></div>
      <img src="/home-bicycle-watercolor.png" alt="Aquarela de uma pessoa pedalando uma bicicleta de madeira entre folhas e flores amarelas" width="1536" height="1024" fetchPriority="high"/>
    </motion.section>
  </motion.div>;
}
