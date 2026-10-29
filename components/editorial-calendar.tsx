"use client";

import {useState,type ReactNode} from "react";
import {ChevronLeft,ChevronRight,Plus} from "lucide-react";
import {calendarDays,dateKey,parseDate,weekDays} from "@/lib/planner.mjs";
import type {Event} from "@/lib/workspace-types";

type Props={today:Date;month:Date;selected:string;weekStart:number;events:Event[];setMonth:(value:Date)=>void;setSelected:(value:string)=>void;renderEvents:(rows:Event[])=>ReactNode;onAdd:()=>void};

export default function EditorialCalendar({today,month,selected,weekStart,events,setMonth,setSelected,renderEvents,onAdd}:Props){
  const [mode,setMode]=useState<"month"|"day">("month");
  const selectedDate=parseDate(selected);
  const dayEvents=events.filter(event=>event.date===selected);
  const changeDay=(step:number)=>{const next=new Date(selectedDate.getFullYear(),selectedDate.getMonth(),selectedDate.getDate()+step,12);setSelected(dateKey(next));setMonth(new Date(next.getFullYear(),next.getMonth(),1));};
  return <section className="editorial-calendar">
    <div className="editorial-tabs" role="tablist" aria-label="Visualização da agenda"><button role="tab" aria-selected={mode==="month"} onClick={()=>setMode("month")}>Mês</button><button role="tab" aria-selected={mode==="day"} onClick={()=>setMode("day")}>Dia</button></div>
    {mode==="month"?<><div className="editorial-calendar-range"><button aria-label="Mês anterior" onClick={()=>setMonth(new Date(month.getFullYear(),month.getMonth()-1,1))}><ChevronLeft/></button><h2>{month.toLocaleDateString("pt-BR",{month:"long"})} <small>{month.getFullYear()}</small></h2><button aria-label="Próximo mês" onClick={()=>setMonth(new Date(month.getFullYear(),month.getMonth()+1,1))}><ChevronRight/></button></div>
    <div className="editorial-month-grid">{weekDays(today,weekStart).map((date:Date)=><span className="editorial-weekday" key={date.getDay()}>{["D","S","T","Q","Q","S","S"][date.getDay()]}</span>)}{Array.from({length:(new Date(month.getFullYear(),month.getMonth(),1).getDay()-weekStart+7)%7},(_,index)=><span key={`blank-${index}`} aria-hidden="true"/>)}{calendarDays(month,weekStart).filter((date:Date)=>date.getMonth()===month.getMonth()).map((date:Date)=>{const value=dateKey(date),count=events.filter(event=>event.date===value).length;return <button key={value} className={(selected===value?"selected ":"")+(value===dateKey(today)?"is-today":"")} aria-label={date.toLocaleDateString("pt-BR",{day:"numeric",month:"long",year:"numeric"})} aria-pressed={selected===value} onClick={()=>setSelected(value)}><span>{date.getDate()}</span>{count>0&&<i aria-label={`${count} evento${count===1?"":"s"}`}/>}</button>})}</div></>:<div className="editorial-day-range"><button aria-label="Dia anterior" onClick={()=>changeDay(-1)}><ChevronLeft/></button><span>{selectedDate.toLocaleDateString("pt-BR",{weekday:"long",day:"numeric",month:"long"})}</span><button aria-label="Próximo dia" onClick={()=>changeDay(1)}><ChevronRight/></button></div>}
    <div className="editorial-day-agenda"><h2>{selectedDate.toLocaleDateString("pt-BR",{weekday:"long",day:"numeric",month:"long"})}</h2>{dayEvents.length?renderEvents(dayEvents):<div className="editorial-empty"><img src="/calendar-watercolor.png" alt="Calendário em aquarela entre folhas verdes e amarelas" width="500" height="333"/><p>Nenhum evento neste dia</p></div>}<button className="primary-button" onClick={onAdd}><Plus size={18}/> Adicionar evento ou nota</button></div>
  </section>;
}
