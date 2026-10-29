"use client";

import type {DragEvent,ReactNode} from "react";
import {motion} from "motion/react";
import {ArrowUpRight,Plus} from "lucide-react";
import {dateKey,dayNames,periods,weekDays} from "@/lib/planner.mjs";
import type {Event,Preferences,Task} from "@/lib/workspace-types";

type Props={today:Date;tasks:Task[];events:Event[];prefs:Preferences;dragging:string|null;taskCard:(task:Task)=>ReactNode;onNewTask:(day:number,period:string)=>void;onMove:(event:DragEvent,day:number,period:string)=>void;onCalendar:(date:string)=>void};

export default function WeeklyPlanner({today,tasks,events,prefs,dragging,taskCard,onNewTask,onMove,onCalendar}:Props){
  const week=weekDays(today,prefs.weekStart) as Date[];
  const roots=tasks.filter(task=>!task.is_parent);
  const done=roots.filter(task=>task.completed).length;
  const open=roots.length-done;
  const withoutTime=roots.filter(task=>!task.completed&&!task.due_time).length;
  const weekKeys=new Set(week.map(dateKey));
  const weekEvents=events.filter(event=>weekKeys.has(event.date));
  const completion=roots.length?Math.round(done*100/roots.length):0;

  return <motion.div className="weekly-experience" initial={{opacity:0,y:14}} animate={{opacity:1,y:0}} transition={{duration:.48,ease:[.22,1,.36,1]}}>
    <section className="week-summary" aria-label="Resumo da semana">
      <div className="week-summary-intent"><span>SUA INTENÇÃO</span><h2>{prefs.focus}</h2><p>{week[0].toLocaleDateString("pt-BR",{day:"numeric",month:"short"})} — {week[6].toLocaleDateString("pt-BR",{day:"numeric",month:"short",year:"numeric"})}</p></div>
      <div className="week-summary-stats"><span><strong>{completion}%</strong> concluído</span><span><strong>{open}</strong> em aberto</span><span><strong>{withoutTime}</strong> sem horário</span><span><strong>{weekEvents.length}</strong> eventos</span></div>
    </section>

    <div className="week-section-head"><div><small>PLANEJAMENTO</small><h2>Sua semana, com espaço para respirar.</h2></div><p>As tarefas ficam no período escolhido. Arraste para reorganizar ou adicione direto em Manhã, Tarde ou Noite.</p></div>

    <div className="week-scroll"><div className="week-board week-board-rich">{week.map(date=>{const isToday=dateKey(date)===dateKey(today);return <section key={dateKey(date)} className={"day-column "+(isToday?"today":"")}>
      <header><div><small>{dayNames[date.getDay()].slice(0,3).toUpperCase()}</small><h2>{date.getDate()}</h2></div>{isToday?<b>HOJE</b>:null}<button className="day-open-calendar" aria-label={"Abrir calendário em "+date.toLocaleDateString("pt-BR",{day:"numeric",month:"long"})} onClick={()=>onCalendar(dateKey(date))}><ArrowUpRight size={14}/></button></header>
      <div className="day-periods">{periods.map(period=>{const rows=tasks.filter(task=>task.weekday===date.getDay()&&task.period===period.id&&(!task.parent_id||!tasks.some(parent=>parent.id===task.parent_id&&parent.weekday===task.weekday&&parent.period===task.period))).sort((a,b)=>(a.due_time||"99:99").localeCompare(b.due_time||"99:99")||a.position-b.position);return <div key={period.id} className={"period-zone "+(dragging?"accept-drop":"")} aria-label={`${period.label}, ${date.toLocaleDateString("pt-BR",{day:"numeric",month:"long"})}`} onDragOver={event=>{if(dragging)event.preventDefault();}} onDrop={event=>onMove(event,date.getDay(),period.id)}><div className="period-heading"><h3>{period.label}</h3><span>{rows.length||"—"}</span></div><div className="period-tasks">{rows.map(task=>taskCard(task))}</div><button className="add-inline" onClick={()=>onNewTask(date.getDay(),period.id)}><Plus size={13}/> Adicionar</button></div>})}</div>
    </section>})}</div></div>
    <p className="week-footnote">{done} tarefas concluídas · {open} em aberto{withoutTime?` · ${withoutTime} sem horário`:""}. Os dias são semanais e permanecem no mesmo lugar ao atualizar uma tarefa.</p>
  </motion.div>;
}
