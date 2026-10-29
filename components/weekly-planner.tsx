"use client";

import {useState,type DragEvent,type ReactNode} from "react";
import {motion} from "motion/react";
import {ArrowUpRight,ChevronLeft,ChevronRight,Plus} from "lucide-react";
import {dateKey,periods,weekDays} from "@/lib/planner.mjs";
import type {Preferences,Task} from "@/lib/workspace-types";

type Props={today:Date;tasks:Task[];prefs:Preferences;dragging:string|null;taskCard:(task:Task)=>ReactNode;onNewTask:(day:number,period:string)=>void;onMove:(event:DragEvent,day:number,period:string)=>void;onCalendar:(date:string)=>void};

export default function WeeklyPlanner({today,tasks,prefs,dragging,taskCard,onNewTask,onMove,onCalendar}:Props){
  const [offset,setOffset]=useState(0);
  const [selectedIndex,setSelectedIndex]=useState((today.getDay()-prefs.weekStart+7)%7);
  const anchor=new Date(today.getFullYear(),today.getMonth(),today.getDate()+offset*7,12);
  const week=weekDays(anchor,prefs.weekStart) as Date[];
  const selected=week[selectedIndex];
  const roots=tasks.filter(task=>task.weekday===selected.getDay()&&!task.parent_id);
  const done=roots.filter(task=>task.completed).length;
  const dateLabel=(date:Date)=>date.toLocaleDateString("pt-BR",{day:"numeric",month:"short"});
  const changeWeek=(direction:number)=>{setOffset(value=>value+direction);setSelectedIndex(0);};
  return <motion.div className="apk-week" initial={{opacity:.9,y:6}} animate={{opacity:1,y:0}} transition={{duration:.26}}>
    <h1>Sua semana</h1>
    <div className="apk-week-range"><button aria-label="Semana anterior" onClick={()=>changeWeek(-1)}><ChevronLeft/></button><span>{dateLabel(week[0])} — {dateLabel(week[6])}</span><button aria-label="Próxima semana" onClick={()=>changeWeek(1)}><ChevronRight/></button></div>
    <div className="apk-week-days" aria-label="Dias da semana">{week.map((date,index)=><button key={dateKey(date)} aria-pressed={selectedIndex===index} aria-label={date.toLocaleDateString("pt-BR",{weekday:"long",day:"numeric",month:"long"})} onClick={()=>setSelectedIndex(index)}><small>{["D","S","T","Q","Q","S","S"][date.getDay()]}</small><strong>{date.getDate()}</strong></button>)}</div>
    <div className="apk-week-status"><span>{roots.length===0?"Um dia aberto para você.":`${done} de ${roots.length} atividades concluídas`}</span><button aria-label="Adicionar tarefa ao dia" onClick={()=>onNewTask(selected.getDay(),prefs.defaultPeriod)}><Plus size={21}/></button></div>
    {roots.length>0&&<div className="apk-week-progress"><span style={{width:`${done*100/roots.length}%`}}/></div>}
    <div className="apk-week-day-title"><h2>{selected.toLocaleDateString("pt-BR",{weekday:"long",day:"numeric"})}</h2><button aria-label="Abrir dia na agenda" onClick={()=>onCalendar(dateKey(selected))}><ArrowUpRight size={18}/></button></div>
    {periods.map(period=>{const rows=tasks.filter(task=>task.weekday===selected.getDay()&&task.period===period.id&&(!task.parent_id||!tasks.some(parent=>parent.id===task.parent_id))).sort((a,b)=>(a.due_time||"99:99").localeCompare(b.due_time||"99:99")||a.position-b.position);return <section key={period.id} className={"apk-week-period "+(dragging?"accept-drop":"")} onDragOver={event=>{if(dragging)event.preventDefault();}} onDrop={event=>onMove(event,selected.getDay(),period.id)}><div className="apk-week-period-title"><h3>{period.label}</h3><span>{rows.length}</span></div>{rows.length?<div className="apk-week-tasks">{rows.map(task=>taskCard(task))}</div>:<p>Nada planejado</p>}<button className="apk-week-add" onClick={()=>onNewTask(selected.getDay(),period.id)}><Plus size={14}/> Adicionar em {period.label.toLowerCase()}</button></section>;})}
  </motion.div>;
}
