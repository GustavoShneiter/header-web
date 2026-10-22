"use client";

import {useState,type CSSProperties} from "react";
import {motion} from "motion/react";
import {ArrowRight,ArrowUpRight,CalendarDays,Check,Flame,Target,TimerReset} from "lucide-react";
import {Checkbox} from "./ui/checkbox";
import {dateKey,dayNames,weekDays} from "@/lib/planner.mjs";
import type {Challenge,Event,Habit,Preferences,Task} from "@/lib/workspace-types";

type HomeTab="today"|"reminders"|"better"|"habits";
type Props={today:Date;tasks:Task[];events:Event[];habits:Habit[];challenges:Challenge[];prefs:Preferences;busy:boolean;onTask:(task:Task)=>void;onToggleTask:(task:Task)=>void;onNewTask:()=>void;onEvent:(event:Event)=>void;onNewEvent:()=>void;onToggleHabit:(habit:Habit)=>void;onHabit:()=>void;onChallenge:()=>void;onWeek:()=>void;onCalendar:(date:string)=>void};

const spring={type:"spring" as const,stiffness:360,damping:30,mass:.75};

export default function HomeDashboard(props:Props){
  const {today,tasks,events,habits,challenges,prefs,busy}=props;
  const [tab,setTab]=useState<HomeTab>("today");
  const todayKey=dateKey(today);
  const week=weekDays(today,prefs.weekStart) as Date[];
  const todayTasks=tasks.filter(task=>task.weekday===today.getDay()&&!task.is_parent);
  const visibleTasks=prefs.showCompleted?todayTasks:todayTasks.filter(task=>!task.completed);
  const orderedTasks=visibleTasks.slice().sort((a,b)=>(a.due_time||"99:99").localeCompare(b.due_time||"99:99")||a.position-b.position);
  const completedTasks=todayTasks.filter(task=>task.completed).length;
  const todayEvents=events.filter(event=>event.date===todayKey).sort((a,b)=>a.time.localeCompare(b.time));
  const todayHabits=habits.filter(habit=>!habit.archived&&habit.days.includes(today.getDay()));
  const habitsDone=todayHabits.filter(habit=>habit.completions.includes(todayKey)).length;
  const activeChallenges=challenges.filter(challenge=>!challenge.archived);
  const openWeek=tasks.filter(task=>!task.completed&&!task.is_parent).length;
  const completion=todayTasks.length?Math.round(completedTasks*100/todayTasks.length):0;
  const weekKeys=new Set(week.map(dateKey));
  const weekEvents=events.filter(event=>weekKeys.has(event.date));

  return <motion.div className="premium-home" initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{duration:.5,ease:[.22,1,.36,1]}}>
    <section className="home-week" aria-label="Esta semana">
      <div className="home-section-label"><div><small>PAINEL SEMANAL</small><span>Sua semana em movimento</span></div><button onClick={props.onWeek}>Organizar <ArrowUpRight size={14}/></button></div>
      <div className="home-week-days">{week.map(day=>{const weekdayTasks=tasks.filter(task=>task.weekday===day.getDay()&&!task.is_parent),done=weekdayTasks.filter(task=>task.completed).length;return <motion.button layout key={dateKey(day)} className={dateKey(day)===todayKey?"is-today":""} whileHover={{y:-4}} whileTap={{scale:.97}} transition={spring} aria-label={"Abrir "+day.toLocaleDateString("pt-BR",{weekday:"long",day:"numeric",month:"long"})} aria-current={dateKey(day)===todayKey?"date":undefined} onClick={()=>props.onCalendar(dateKey(day))}><small>{dayNames[day.getDay()].slice(0,3)}</small><strong>{day.getDate()}</strong><span>{done}/{weekdayTasks.length}</span><i style={{"--day-load":weekdayTasks.length?`${Math.max(18,done*100/weekdayTasks.length)}%`:"8%"} as CSSProperties}/></motion.button>})}</div>
    </section>

    <div className="home-overview-grid">
      <motion.section className="home-command" layout transition={spring} aria-label="Seu dia">
        <div className="home-command-meta"><span>RITMO DE HOJE</span><strong>{completion}%</strong></div>
        <div className="home-tabs" role="tablist" aria-label="Resumo do dia">{([ ["today","Hoje"],["reminders","Agenda"],["better","1% melhor"],["habits","Hábitos"] ] as const).map(([id,label])=><button key={id} type="button" role="tab" aria-selected={tab===id} onClick={()=>setTab(id)}>{tab===id?<motion.i layoutId="home-tab-lens" transition={spring}/>:null}<span>{label}</span></button>)}</div>
        <div className="home-command-head"><div><span className="home-kicker">{tab==="today"?"AGORA":tab==="reminders"?"PRÓXIMOS HORÁRIOS":tab==="better"?"DIREÇÃO":"CONSISTÊNCIA"}</span><h2>{tab==="today"?"Prioridades do dia":tab==="reminders"?"Agenda de hoje":tab==="better"?"Próximo avanço":"Hábitos de hoje"}</h2></div></div>
        <div className="home-rows">
          {tab==="today"&&(orderedTasks.length?orderedTasks.slice(0,4).map(task=><motion.div layout className="home-row" key={task.id}><span className="home-row-time">{task.due_time||"Hoje"}</span><Checkbox checked={task.completed} disabled={busy} aria-label={"Concluir "+task.title} onCheckedChange={()=>props.onToggleTask(task)}/><button className="home-row-copy" onClick={()=>props.onTask(task)}><strong>{task.title}</strong><small>{task.description||"Sem detalhe adicional"}</small></button><button className="home-row-arrow" aria-label={"Editar "+task.title} onClick={()=>props.onTask(task)}><ArrowUpRight size={17}/></button></motion.div>):<div className="home-empty"><Target size={22}/><span>Seu dia está livre. Use a Semana para organizar o que vem a seguir.</span><button onClick={props.onWeek}>Abrir semana <ArrowRight size={14}/></button></div>)}
          {tab==="reminders"&&(todayEvents.length?todayEvents.slice(0,4).map(event=><motion.button layout className="home-row" key={event.id} onClick={()=>props.onEvent(event)}><span className="home-row-time">{event.time||"Dia todo"}</span><span className="home-row-event-dot" style={{background:event.color}}/><span className="home-row-copy"><strong>{event.title}</strong><small>{event.type}{event.description?" · "+event.description:""}</small></span><ArrowUpRight size={17}/></motion.button>):<div className="home-empty"><CalendarDays size={22}/><span>Nenhum compromisso marcado para hoje.</span><button onClick={()=>props.onCalendar(todayKey)}>Abrir calendário <ArrowRight size={14}/></button></div>)}
          {tab==="better"&&(activeChallenges.length?activeChallenges.slice(0,4).map(challenge=><motion.button layout className="home-row" key={challenge.id} onClick={props.onChallenge}><span className="home-row-symbol"><Target size={17}/></span><span className="home-row-copy"><strong>{challenge.title}</strong><small>{challenge.strategy||challenge.desired||"Registre um pequeno avanço hoje"}</small></span><ArrowUpRight size={17}/></motion.button>):<div className="home-empty"><Target size={22}/><span>Defina uma direção para a sua evolução.</span><button onClick={props.onChallenge}>Explorar desafios <ArrowRight size={14}/></button></div>)}
          {tab==="habits"&&(todayHabits.length?todayHabits.slice(0,4).map(habit=><motion.div layout className="home-row" key={habit.id}><span className="home-row-symbol"><Flame size={17}/></span><Checkbox checked={habit.completions.includes(todayKey)} disabled={busy} aria-label={"Concluir hábito "+habit.title} onCheckedChange={()=>props.onToggleHabit(habit)}/><span className="home-row-copy"><strong>{habit.title}</strong><small>{habit.goal||"Um pequeno passo hoje"}</small></span></motion.div>):<div className="home-empty"><Flame size={22}/><span>Nenhum hábito programado para hoje.</span><button onClick={props.onHabit}>Ver hábitos <ArrowRight size={14}/></button></div>)}
        </div>
        <div className="home-command-foot"><span><Check size={15}/>{completedTasks} de {todayTasks.length} tarefas concluídas</span><button onClick={tab==="reminders"?()=>props.onCalendar(todayKey):tab==="habits"?props.onHabit:tab==="better"?props.onChallenge:props.onWeek}>Ver contexto <ArrowRight size={15}/></button></div>
      </motion.section>

      <aside className="home-signal-stack" aria-label="Sinais da semana">
        <motion.button className="home-signal home-signal-focus" whileHover={{y:-4}} transition={spring} onClick={props.onWeek}><span className="signal-index">01</span><small>INTENÇÃO DA SEMANA</small><strong>{prefs.focus}</strong><span className="signal-link">Revisar planejamento <ArrowUpRight size={14}/></span><i/></motion.button>
        <div className="home-signal-pair">
          <motion.button className="home-signal" whileHover={{y:-3}} transition={spring} onClick={props.onWeek}><TimerReset size={18}/><strong>{openWeek}</strong><small>itens em aberto</small></motion.button>
          <motion.button className="home-signal" whileHover={{y:-3}} transition={spring} onClick={()=>props.onCalendar(todayKey)}><CalendarDays size={18}/><strong>{weekEvents.length}</strong><small>eventos na semana</small></motion.button>
        </div>
        <motion.button className="home-signal home-signal-habit" whileHover={{y:-3}} transition={spring} onClick={props.onHabit}><Flame size={18}/><span><strong>{habitsDone}/{todayHabits.length}</strong><small>rituais concluídos hoje</small></span><ArrowUpRight size={16}/></motion.button>
      </aside>
    </div>
  </motion.div>;
}
