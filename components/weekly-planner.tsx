"use client";

import type {DragEvent,ReactNode} from "react";
import {motion} from "motion/react";
import {ArrowUpRight,CalendarDays,CheckCircle2,Clock3,Plus,Sparkles} from "lucide-react";
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
  const busiest=week.reduce((best,date)=>{const amount=roots.filter(task=>task.weekday===date.getDay()).length;return amount>best.amount?{date,amount}:best;},{date:week[0],amount:-1});
  const completion=roots.length?Math.round(done*100/roots.length):0;

  return <motion.div className="weekly-experience" initial={{opacity:0,y:14}} animate={{opacity:1,y:0}} transition={{duration:.48,ease:[.22,1,.36,1]}}>
    <section className="week-intelligence glass-surface">
      <div className="week-intention"><span><Sparkles size={15}/> INTENÇÃO</span><h2>{prefs.focus}</h2><p>{week[0].toLocaleDateString("pt-BR",{day:"numeric",month:"short"})} — {week[6].toLocaleDateString("pt-BR",{day:"numeric",month:"short",year:"numeric"})}</p></div>
      <div className="week-metrics">
        <article><small>Progresso</small><strong>{completion}%</strong><span>{done} concluídas</span></article>
        <article><small>Em aberto</small><strong>{open}</strong><span>{withoutTime} sem horário</span></article>
        <article><small>Agenda</small><strong>{weekEvents.length}</strong><span>eventos datados</span></article>
        <article><small>Maior carga</small><strong>{busiest.amount>0?dayNames[busiest.date.getDay()].replace("-feira",""):"Livre"}</strong><span>{Math.max(0,busiest.amount)} itens</span></article>
      </div>
    </section>

    <div className="week-section-head"><div><small>ORGANIZAÇÃO</small><h2>Mapa de energia da semana</h2></div><p>Arraste tarefas entre períodos. O painel mede a carga real sem esconder o que ainda está solto.</p></div>

    <div className="week-scroll"><div className="week-board week-board-rich">{week.map(date=>{const dayTasks=roots.filter(task=>task.weekday===date.getDay()),dayDone=dayTasks.filter(task=>task.completed).length,isToday=dateKey(date)===dateKey(today);return <section key={dateKey(date)} className={"day-column "+(isToday?"today":"")}>
      <header><div><small>{dayNames[date.getDay()].slice(0,3).toUpperCase()}</small><h2>{date.getDate()}</h2></div>{isToday?<b>HOJE</b>:<span>{dayDone}/{dayTasks.length}</span>}<i><u style={{width:dayTasks.length?`${dayDone*100/dayTasks.length}%`:"0%"}}/></i></header>
      {periods.map(period=>{const rows=tasks.filter(task=>task.weekday===date.getDay()&&task.period===period.id&&(!task.parent_id||!tasks.some(parent=>parent.id===task.parent_id&&parent.weekday===task.weekday&&parent.period===task.period))).sort((a,b)=>a.position-b.position);return <div key={period.id} className={"period-zone "+(dragging?"accept-drop":"")} onDragOver={event=>{if(dragging)event.preventDefault();}} onDrop={event=>onMove(event,date.getDay(),period.id)}><div className="period-heading"><h3>{period.label}</h3><span>{rows.length}</span></div>{rows.map(task=>taskCard(task))}<button className="add-inline" onClick={()=>onNewTask(date.getDay(),period.id)}><Plus size={13}/> Adicionar</button></div>})}
    </section>})}</div></div>

    <section className="week-organizer">
      <div className="week-organizer-copy"><small>LEITURA DA SEMANA</small><h2>Clareza antes de velocidade.</h2><p>{withoutTime?`${withoutTime} ${withoutTime===1?"tarefa ainda está":"tarefas ainda estão"} sem horário. Distribua primeiro o que exige energia, depois encaixe o restante.`:"As tarefas abertas já têm horário. Agora proteja os blocos mais importantes."}</p></div>
      <div className="week-organizer-signals">
        <button onClick={()=>onCalendar(dateKey(today))}><CalendarDays size={18}/><span><strong>Agenda conectada</strong><small>{weekEvents.length?`${weekEvents.length} compromissos nesta semana`:"Nenhum compromisso datado"}</small></span><ArrowUpRight size={16}/></button>
        <div><Clock3 size={18}/><span><strong>{withoutTime} sem horário</strong><small>itens que ainda pedem decisão</small></span></div>
        <div><CheckCircle2 size={18}/><span><strong>{done} concluídas</strong><small>progresso real da rotina</small></span></div>
      </div>
    </section>
  </motion.div>;
}
