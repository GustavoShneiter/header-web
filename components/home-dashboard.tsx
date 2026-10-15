"use client";

import {useState} from "react";
import {ArrowRight,ArrowUpRight,CalendarDays,Check,Flame,Plus,Target,Timer} from "lucide-react";
import {Checkbox} from "./ui/checkbox";
import {dateKey,dayNames,weekDays} from "@/lib/planner.mjs";
import type {Challenge,Event,Habit,Preferences,Task} from "@/lib/workspace-types";

type HomeTab="today"|"reminders"|"better"|"habits";
type Props={today:Date;tasks:Task[];events:Event[];habits:Habit[];challenges:Challenge[];prefs:Preferences;busy:boolean;onTask:(task:Task)=>void;onToggleTask:(task:Task)=>void;onNewTask:()=>void;onEvent:(event:Event)=>void;onNewEvent:()=>void;onToggleHabit:(habit:Habit)=>void;onHabit:()=>void;onChallenge:()=>void;onWeek:()=>void;onCalendar:(date:string)=>void;onPomodoro:()=>void};

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
  const completedHabits=todayHabits.filter(habit=>habit.completions.includes(todayKey)).length;
  const activeChallenges=challenges.filter(challenge=>!challenge.archived);

  return <div className="premium-home">
    <section className="home-week" aria-label="Esta semana"><div className="home-section-label"><span>Sua semana</span><button onClick={props.onWeek}>Planejar <ArrowUpRight size={14}/></button></div><div className="home-week-days">{week.map(day=><button key={dateKey(day)} className={dateKey(day)===todayKey?"is-today":""} aria-label={"Abrir "+day.toLocaleDateString("pt-BR",{weekday:"long",day:"numeric",month:"long"})} aria-current={dateKey(day)===todayKey?"date":undefined} onClick={()=>props.onCalendar(dateKey(day))}><small>{dayNames[day.getDay()].slice(0,3)}</small><strong>{day.getDate()}</strong><i className={events.some(event=>event.date===dateKey(day))?"has-event":""}/></button>)}</div></section>

    <section className="home-command" aria-label="Seu dia"><div className="home-tabs" role="tablist" aria-label="Resumo do dia">{([ ["today","Hoje"],["reminders","Lembretes"],["better","1% melhor"],["habits","Hábitos"] ] as const).map(([id,label])=><button key={id} type="button" role="tab" aria-selected={tab===id} onClick={()=>setTab(id)}>{label}</button>)}</div>
      <div className="home-command-head"><div><span className="home-kicker">{tab==="today"?"NO SEU RITMO":tab==="reminders"?"NA SUA AGENDA":tab==="better"?"PEQUENOS PASSOS":"CUIDE DE VOCÊ"}</span><h2>{tab==="today"?"Prioridades de hoje":tab==="reminders"?"Lembretes do dia":tab==="better"?"Evoluir um pouco":"Hábitos de hoje"}</h2></div><button className="home-add" aria-label={tab==="reminders"?"Adicionar evento":tab==="habits"?"Ver hábitos":tab==="better"?"Ver desafios":"Adicionar tarefa"} onClick={tab==="reminders"?props.onNewEvent:tab==="habits"?props.onHabit:tab==="better"?props.onChallenge:props.onNewTask}><Plus size={18}/></button></div>
      <div className="home-rows">
        {tab==="today"&&(orderedTasks.length?orderedTasks.slice(0,4).map(task=><div className="home-row" key={task.id}><span className="home-row-time">{task.due_time||"Hoje"}</span><Checkbox checked={task.completed} disabled={busy} aria-label={"Concluir "+task.title} onCheckedChange={()=>props.onToggleTask(task)}/><button className="home-row-copy" onClick={()=>props.onTask(task)}><strong>{task.title}</strong><small>{task.description||"Toque para ver os detalhes"}</small></button><button className="home-row-arrow" aria-label={"Editar "+task.title} onClick={()=>props.onTask(task)}><ArrowUpRight size={17}/></button></div>):<div className="home-empty"><Target size={22}/><span>Seu dia está livre para começar.</span><button onClick={props.onNewTask}>Criar primeira tarefa <ArrowRight size={14}/></button></div>)}
        {tab==="reminders"&&(todayEvents.length?todayEvents.slice(0,4).map(event=><button className="home-row" key={event.id} onClick={()=>props.onEvent(event)}><span className="home-row-time">{event.time||"Dia todo"}</span><span className="home-row-event-dot" style={{background:event.color}}/><span className="home-row-copy"><strong>{event.title}</strong><small>{event.type}{event.description?" · "+event.description:""}</small></span><ArrowUpRight size={17}/></button>):<div className="home-empty"><CalendarDays size={22}/><span>Nenhum evento para hoje.</span><button onClick={props.onNewEvent}>Adicionar evento <ArrowRight size={14}/></button></div>)}
        {tab==="better"&&(activeChallenges.length?activeChallenges.slice(0,4).map(challenge=><button className="home-row" key={challenge.id} onClick={props.onChallenge}><span className="home-row-symbol"><Target size={17}/></span><span className="home-row-copy"><strong>{challenge.title}</strong><small>{challenge.strategy||challenge.desired||"Registre um pequeno avanço hoje"}</small></span><ArrowUpRight size={17}/></button>):<div className="home-empty"><Target size={22}/><span>Seu próximo desafio começa com um passo.</span><button onClick={props.onChallenge}>Explorar desafios <ArrowRight size={14}/></button></div>)}
        {tab==="habits"&&(todayHabits.length?todayHabits.slice(0,4).map(habit=><div className="home-row" key={habit.id}><span className="home-row-symbol"><Flame size={17}/></span><Checkbox checked={habit.completions.includes(todayKey)} disabled={busy} aria-label={"Concluir hábito "+habit.title} onCheckedChange={()=>props.onToggleHabit(habit)}/><span className="home-row-copy"><strong>{habit.title}</strong><small>{habit.goal||"Um pequeno passo hoje"}</small></span></div>):<div className="home-empty"><Flame size={22}/><span>Nenhum hábito programado para hoje.</span><button onClick={props.onHabit}>Ver hábitos <ArrowRight size={14}/></button></div>)}
      </div>
      <div className="home-command-foot"><span><Check size={15}/>{completedTasks} de {todayTasks.length} tarefas concluídas</span><button onClick={tab==="reminders"?()=>props.onCalendar(todayKey):tab==="habits"?props.onHabit:tab==="better"?props.onChallenge:props.onWeek}>Ver tudo <ArrowRight size={15}/></button></div>
    </section>

    <div className="home-lower-grid"><section className="home-focus glass-surface"><div><span className="home-kicker"><Target size={15}/> FOCO DA SEMANA</span><h2>{prefs.focus||"Um passo de cada vez."}</h2><span className="home-focus-progress"><i style={{width:(todayTasks.length?completedTasks/todayTasks.length*100:0)+"%"}}/></span><small>{completedTasks} de {todayTasks.length} tarefas de hoje</small></div><span className="home-focus-orbit" aria-hidden="true"/></section><div className="home-small-grid"><button className="home-mini glass-surface" onClick={props.onPomodoro}><span className="home-mini-icon"><Timer size={21}/></span><span><strong>Pomodoro</strong><small>Abra seu tempo de foco</small></span><ArrowUpRight size={18}/></button><button className="home-mini glass-surface" onClick={props.onHabit}><span className="home-mini-icon"><Flame size={21}/></span><span><strong>Hábitos de hoje</strong><small>{completedHabits} de {todayHabits.length} concluídos</small></span><ArrowUpRight size={18}/></button></div></div>
  </div>;
}
