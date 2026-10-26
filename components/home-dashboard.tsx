"use client";

import {ArrowRight,ArrowUpRight,Flame,WalletCards} from "lucide-react";
import {Checkbox} from "./ui/checkbox";
import {dateKey,dayNames,weekDays} from "@/lib/planner.mjs";
import type {Challenge,Event,FinanceItem,Habit,Preferences,Task} from "@/lib/workspace-types";

type Props={today:Date;tasks:Task[];events:Event[];habits:Habit[];challenges:Challenge[];financeItems:FinanceItem[];prefs:Preferences;busy:boolean;onTask:(task:Task)=>void;onToggleTask:(task:Task)=>void;onNewTask:()=>void;onEvent:(event:Event)=>void;onNewEvent:()=>void;onToggleHabit:(habit:Habit)=>void;onHabit:()=>void;onChallenge:()=>void;onFinance:()=>void;onWeek:()=>void;onCalendar:(date:string)=>void};

const money=new Intl.NumberFormat("pt-BR",{style:"currency",currency:"BRL",maximumFractionDigits:0});

export default function HomeDashboard(props:Props){
  const {today,tasks,events,habits,challenges,financeItems,prefs,busy}=props;
  const todayKey=dateKey(today);
  const week=weekDays(today,prefs.weekStart) as Date[];
  const roots=tasks.filter(task=>!task.is_parent);
  const todayTasks=roots.filter(task=>task.weekday===today.getDay()).sort((a,b)=>(a.due_time||"99:99").localeCompare(b.due_time||"99:99")||a.position-b.position);
  const visibleTasks=prefs.showCompleted?todayTasks:todayTasks.filter(task=>!task.completed);
  const todayEvents=events.filter(event=>event.date===todayKey).sort((a,b)=>a.time.localeCompare(b.time));
  const todayHabits=habits.filter(habit=>!habit.archived&&habit.days.includes(today.getDay()));
  const habitsDone=todayHabits.filter(habit=>habit.completions.includes(todayKey)).length;
  const activeChallenges=challenges.filter(challenge=>!challenge.archived);
  const income=financeItems.filter(item=>item.kind==="income").reduce((sum,item)=>sum+Number(item.amount),0);
  const bills=financeItems.filter(item=>item.kind==="bill").reduce((sum,item)=>sum+Number(item.amount),0);
  const balance=income-bills;
  const freeRatio=income?Math.round(balance*100/income):0;
  const nextBill=financeItems.find(item=>item.kind==="bill");
  const openWeek=roots.filter(task=>!task.completed).length;
  const weekKeys=new Set(week.map(dateKey));
  const weekEvents=events.filter(event=>weekKeys.has(event.date));
  const completionByDay=week.map(day=>{const rows=roots.filter(task=>task.weekday===day.getDay());return rows.length?Math.round(rows.filter(task=>task.completed).length*100/rows.length):0;});
  const points=completionByDay.map((value,index)=>`${18+index*54},${108-value*.82}`).join(" ");
  const completedToday=todayTasks.filter(task=>task.completed).length;
  const completion=todayTasks.length?Math.round(completedToday*100/todayTasks.length):0;
  const now=Math.max(0,Math.min(100,((today.getHours()+today.getMinutes()/60-6)/16)*100));
  const dayRows=[
    ...todayEvents.map(event=>({id:event.id,time:event.time||"Dia todo",title:event.title,detail:event.type,kind:"event" as const,event})),
    ...visibleTasks.map(task=>({id:task.id,time:task.due_time||"Hoje",title:task.title,detail:task.description||"Planejamento",kind:"task" as const,task})),
  ].sort((a,b)=>(a.time==="Hoje"?"99:98":a.time==="Dia todo"?"00:00":a.time).localeCompare(b.time==="Hoje"?"99:98":b.time==="Dia todo"?"00:00":b.time));

  return <div className="continuum-home" style={{"--now":`${now}%`} as React.CSSProperties}>
    <section className="continuum-week" aria-label="Panorama da semana">
      <button className="continuum-week-copy" onClick={props.onWeek}><span>{week[0].toLocaleDateString("pt-BR",{day:"numeric",month:"short"})} — {week[6].toLocaleDateString("pt-BR",{day:"numeric",month:"short"})}</span><strong>Semana em curso</strong><ArrowUpRight size={16}/></button>
      <div className="continuum-week-days">{week.map((day,index)=>{const dayTasks=roots.filter(task=>task.weekday===day.getDay()),done=dayTasks.filter(task=>task.completed).length,isToday=dateKey(day)===todayKey;return <button key={dateKey(day)} className={isToday?"is-today":""} aria-current={isToday?"date":undefined} onClick={()=>props.onCalendar(dateKey(day))}><small>{dayNames[day.getDay()].slice(0,3)}</small><strong>{day.getDate()}</strong><span>{dayTasks.length?`${done}/${dayTasks.length}`:"livre"}</span><i style={{width:`${completionByDay[index]}%`}}/></button>})}</div>
    </section>

    <section className="continuum-board">
      <div className="continuum-agenda">
        <header><div><h2>Hoje</h2><p>{dayRows.length?`${dayRows.length} momentos organizados`:`Seu dia ainda está aberto`}</p></div><button onClick={()=>props.onCalendar(todayKey)}>Abrir calendário <ArrowRight size={15}/></button></header>
        <div className="continuum-time-axis" aria-hidden="true"><i/></div>
        <div className="continuum-rows">
          {dayRows.length?dayRows.slice(0,7).map(row=><article className="continuum-row" key={row.kind+row.id}>
            <time>{row.time}</time><span className="continuum-node"/>
            {row.kind==="task"?<Checkbox checked={row.task.completed} disabled={busy} aria-label={"Concluir "+row.title} onCheckedChange={()=>props.onToggleTask(row.task)}/>:<span className="continuum-event-mark" style={{background:row.event.color}}/>}
            <button onClick={()=>row.kind==="task"?props.onTask(row.task):props.onEvent(row.event)}><strong>{row.title}</strong><small>{row.detail}</small></button><ArrowUpRight size={15}/>
          </article>):<div className="continuum-empty"><WalletCards size={20}/><p>Nenhum compromisso para hoje.</p><button onClick={props.onWeek}>Organizar a semana <ArrowRight size={14}/></button></div>}
        </div>
      </div>

      <div className="continuum-momentum">
        <header><div><h2>Ritmo semanal</h2><p>Conclusão por dia</p></div><strong>{completion}%<small> hoje</small></strong></header>
        <svg className="continuum-chart" viewBox="0 0 360 132" role="img" aria-label="Gráfico de conclusão da semana">
          <line x1="18" y1="108" x2="342" y2="108"/><line x1="18" y1="67" x2="342" y2="67"/><line x1="18" y1="26" x2="342" y2="26"/><polyline points={points}/>{completionByDay.map((value,index)=><circle key={index} cx={18+index*54} cy={108-value*.82} r={index===week.findIndex(day=>dateKey(day)===todayKey)?5:3}/>) }
        </svg>
        <div className="continuum-chart-labels">{week.map(day=><span key={dateKey(day)}>{dayNames[day.getDay()].slice(0,3)}</span>)}</div>
        <div className="continuum-capacity"><span><b>{openWeek}</b> tarefas abertas</span><span><b>{weekEvents.length}</b> eventos</span><span><b>{completedToday}</b> feitas hoje</span></div>
      </div>

      <aside className="continuum-signals">
        <section className="continuum-focus"><h2>Intenção da semana</h2><p>{prefs.focus}</p><button onClick={props.onWeek}>Revisar plano <ArrowUpRight size={15}/></button></section>
        <section><header><div><h2>Rituais</h2><p>{habitsDone} de {todayHabits.length} concluídos</p></div><button onClick={props.onHabit}>Ver todos</button></header><div className="continuum-habits">{todayHabits.slice(0,3).map(habit=><label key={habit.id}><Checkbox checked={habit.completions.includes(todayKey)} disabled={busy} aria-label={"Concluir hábito "+habit.title} onCheckedChange={()=>props.onToggleHabit(habit)}/><span><strong>{habit.title}</strong><small>{habit.goal||"Um pequeno passo hoje"}</small></span><Flame size={15}/></label>)}{!todayHabits.length&&<button className="continuum-inline-empty" onClick={props.onHabit}>Nenhum ritual programado <ArrowRight size={14}/></button>}</div></section>
        <section className="continuum-finance"><header><div><h2>Margem do mês</h2><p>{freeRatio>=0?`+${freeRatio}% das entradas livres`:`${freeRatio}% além das entradas`}</p></div><button onClick={props.onFinance}>Ver financeiro</button></header><button className="continuum-finance-value" onClick={props.onFinance}><WalletCards size={17}/><span><strong>{money.format(balance)}</strong><small>{balance>=0?"saldo livre depois das contas":"saldo previsto negativo"}</small></span><ArrowUpRight size={15}/></button><div className="continuum-finance-next"><span>Próximo compromisso</span><strong>{nextBill?`${nextBill.title} · ${money.format(Number(nextBill.amount))}`:"Nenhuma conta cadastrada"}</strong></div>{activeChallenges[0]&&<button className="continuum-challenge-link" onClick={props.onChallenge}>{activeChallenges[0].title}<ArrowRight size={13}/></button>}</section>
      </aside>
    </section>
  </div>;
}
