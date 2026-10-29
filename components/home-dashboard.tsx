"use client";

import {useEffect,useRef,useState} from "react";
import {motion} from "motion/react";
import {ChevronLeft,ChevronRight} from "lucide-react";
import {dateKey} from "@/lib/planner.mjs";
import type {Challenge,Event,Habit,Task} from "@/lib/workspace-types";

type Props={today:Date;tasks:Task[];events:Event[];habits:Habit[];challenges:Challenge[];onWeek:()=>void;onCalendar:(date:string)=>void;onHabit:()=>void;onChallenge:()=>void};
const labels=["Hoje","Lembretes","1% Melhor","Hábitos"];

export default function HomeDashboard({today,tasks,events,habits,challenges,onWeek,onCalendar,onHabit,onChallenge}:Props){
  const [slide,setSlide]=useState(0);
  const todayKey=dateKey(today);
  const dateTrack=useRef<HTMLDivElement>(null);
  const anchor=useRef<HTMLButtonElement>(null);
  const startX=useRef(0);
  const dates=Array.from({length:121},(_,index)=>{const date=new Date(today.getFullYear(),today.getMonth(),today.getDate()+index-30,12);return {date,key:dateKey(date)};});
  useEffect(()=>{anchor.current?.scrollIntoView({block:"nearest",inline:"center"});},[todayKey]);
  const todayTasks=tasks.filter(task=>task.weekday===today.getDay()&&!task.parent_id);
  const taskDone=todayTasks.filter(task=>task.completed).length;
  const todayEvents=events.filter(event=>event.date===todayKey);
  const todayHabits=habits.filter(habit=>!habit.archived&&habit.days.includes(today.getDay()));
  const habitDone=todayHabits.filter(habit=>habit.completions.includes(todayKey)).length;
  const activeChallenge=challenges.find(challenge=>!challenge.archived);
  const content=[
    {value:String(todayTasks.length-taskDone).padStart(2,"0"),unit:"atividades para hoje",detail:todayTasks.find(task=>!task.completed)?.title||"Tudo em dia. Aproveite seu tempo.",progress:todayTasks.length?taskDone/todayTasks.length:0},
    {value:String(todayEvents.length).padStart(2,"0"),unit:"momentos na agenda",detail:todayEvents[0]?`${todayEvents[0].time||"Hoje"} · ${todayEvents[0].title}`:"Um espaço livre no seu dia.",progress:null},
    {value:"1%",unit:"melhor a cada passo",detail:activeChallenge?.strategy||"O que você quer transformar?",progress:null},
    {value:`${habitDone}/${todayHabits.length}`,unit:"hábitos feitos hoje",detail:habitDone===todayHabits.length&&todayHabits.length>0?"Você cuidou de você hoje.":"Pequenas ações. Uma nova versão de você.",progress:todayHabits.length?habitDone/todayHabits.length:0},
  ];
  const openSlide=()=>{if(slide===0)onWeek();else if(slide===1)onCalendar(todayKey);else if(slide===2)onChallenge();else onHabit();};
  const active=content[slide];
  return <div className="apk-home">
    <section className="home-date-window" aria-label="Navegar pelas datas"><button className="home-date-arrow" aria-label="Datas anteriores" onClick={()=>dateTrack.current?.scrollBy({left:-406,behavior:"smooth"})}><ChevronLeft size={18}/></button><div className="home-date-rail" ref={dateTrack}>
      {dates.map(({date,key})=>{const current=key===todayKey;return <button key={key} ref={current?anchor:undefined} className={current?"is-today":""} aria-current={current?"date":undefined} aria-label={`Abrir agenda em ${date.toLocaleDateString("pt-BR",{weekday:"long",day:"numeric",month:"long"})}`} onClick={()=>onCalendar(key)}><small>{["D","S","T","Q","Q","S","S"][date.getDay()]}</small><strong>{date.getDate()}</strong></button>;})}
    </div><button className="home-date-arrow" aria-label="Próximas datas" onClick={()=>dateTrack.current?.scrollBy({left:406,behavior:"smooth"})}><ChevronRight size={18}/></button></section>
    <div className="apk-home-tabs" role="tablist" aria-label="Resumo"><>{labels.map((label,index)=><button key={label} role="tab" aria-selected={slide===index} onClick={()=>setSlide(index)}>{label}</button>)}</></div>
    <motion.button key={slide} className="apk-home-slide" initial={{opacity:.75,y:6}} animate={{opacity:1,y:0}} transition={{duration:.22}} onClick={openSlide} onTouchStart={event=>{startX.current=event.touches[0].clientX;}} onTouchEnd={event=>{const difference=event.changedTouches[0].clientX-startX.current;if(Math.abs(difference)>45){event.preventDefault();setSlide(value=>(value+(difference<0?1:3))%4);}}} aria-label={`${labels[slide]}: ${active.value} ${active.unit}. ${active.detail}. Abrir seção`}>
      <div className="apk-slide-meta"><span>{labels[slide].toUpperCase()}</span><span>0{slide+1} / 04</span></div>
      <div className="apk-slide-main"><div><strong>{active.value}</strong><span>{active.unit}</span></div><i aria-hidden="true"/></div>
      {active.progress!==null&&<div className="apk-slide-progress"><span style={{width:`${active.progress*100}%`}}/></div>}
      <p>{active.detail}</p>
    </motion.button>
    <div className="apk-slide-controls"><button aria-label="Resumo anterior" onClick={()=>setSlide(value=>(value+3)%4)}><ChevronLeft size={19}/></button><div aria-label={`Resumo ${slide+1} de 4`}>{labels.map((label,index)=><i key={label} className={index===slide?"active":""}/>)}</div><button aria-label="Próximo resumo" onClick={()=>setSlide(value=>(value+1)%4)}><ChevronRight size={19}/></button></div>
    <img className="apk-home-art" src="/home-bicycle-watercolor.png" alt="Pessoa pedalando uma bicicleta de madeira entre folhas e flores amarelas" width="1536" height="1024"/>
  </div>;
}
