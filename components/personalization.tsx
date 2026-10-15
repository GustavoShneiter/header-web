"use client";

import {Check,Monitor,Moon,Sun} from "lucide-react";
import {Choice,Field} from "./planner-fields";
import {Switch} from "./ui/switch";
import {Popover,PopoverContent,PopoverTrigger} from "./ui/popover";
import {periods} from "@/lib/planner.mjs";
import type {AccentColor,Preferences} from "@/lib/workspace-types";

const themes=[{id:"light",label:"Claro",icon:Sun},{id:"dark",label:"Escuro",icon:Moon},{id:"system",label:"Sistema",icon:Monitor}] as const;
const accents:[AccentColor,string,string][]=[
  ["coral","Coral","#fb714c"],["violet","Violeta","#8268d8"],["ocean","Oceano","#2877bb"],
  ["jade","Jade","#218a78"],["amber","Âmbar","#c68024"],["berry","Ameixa","#b35382"],
];

export function AppearanceMenu({theme,busy,onSelect}:{theme:Preferences["theme"];busy:boolean;onSelect:(theme:Preferences["theme"])=>void}){
  return <Popover><PopoverTrigger asChild><button className="appearance-trigger" aria-label="Escolher aparência" title="Aparência"><Sun size={20}/></button></PopoverTrigger><PopoverContent align="start" sideOffset={12} className="appearance-popover"><div className="appearance-head"><span className="appearance-icon"><Sun size={17}/></span><div><strong>Aparência</strong><small>Escolha o clima da sua tela.</small></div></div><div className="appearance-themes">{themes.map(item=><button key={item.id} type="button" className={"appearance-option is-"+item.id} aria-label={"Usar tema "+item.label.toLowerCase()} aria-pressed={theme===item.id} disabled={busy} onClick={()=>onSelect(item.id)}><span className="appearance-option-art"><item.icon size={22}/></span><span>{item.label}</span>{theme===item.id&&<Check size={15} className="appearance-check"/>}</button>)}</div><p>As cores e os detalhes do vidro ficam no seu perfil.</p></PopoverContent></Popover>;
}

export function PersonalizationFields({value,onChange}:{value:Preferences;onChange:(value:Preferences)=>void}){
  return <div className="personalization-fields">
    <div className="settings-heading"><span>Seu visual</span><h3>Faça o Header ter a sua cara.</h3><p>A cor escolhida aparece nos botões, indicadores e destaques em todas as telas.</p></div>
    <div className="settings-group"><span className="settings-label">Cor base</span><div className="accent-options" role="radiogroup" aria-label="Cor base do aplicativo">{accents.map(([id,label,color])=><button key={id} type="button" role="radio" aria-checked={value.accent===id} className="accent-option" onClick={()=>onChange({...value,accent:id})}><span className="accent-swatch" style={{background:color}}>{value.accent===id&&<Check size={17}/>}</span><span>{label}</span></button>)}</div></div>
    <div className="settings-group"><span className="settings-label">Tema</span><div className="theme-settings" role="radiogroup" aria-label="Tema do aplicativo">{themes.map(item=><button key={item.id} type="button" role="radio" aria-checked={value.theme===item.id} onClick={()=>onChange({...value,theme:item.id})}><item.icon size={18}/><span>{item.label}</span>{value.theme===item.id&&<Check size={15}/>}</button>)}</div></div>
    <div className="form-grid"><Choice label="Intensidade do vidro" value={value.glass} onChange={v=>onChange({...value,glass:v as Preferences["glass"]})} options={[{value:"soft",label:"Suave"},{value:"balanced",label:"Equilibrada"},{value:"vivid",label:"Marcante"}]}/><Choice label="A semana começa em" value={String(value.weekStart)} onChange={v=>onChange({...value,weekStart:Number(v)})} options={[{value:"0",label:"Domingo"},{value:"1",label:"Segunda-feira"}]}/><Choice label="Período padrão das tarefas" value={value.defaultPeriod} onChange={v=>onChange({...value,defaultPeriod:v})} options={periods.map(period=>({value:period.id,label:period.label}))}/></div>
    <Field label="Foco da semana"><textarea maxLength={500} rows={3} value={value.focus} onChange={event=>onChange({...value,focus:event.target.value})}/></Field>
    <label className="setting-row"><span>Movimento suave<small>Reflexos e transições delicadas pelo app.</small></span><Switch checked={value.motion==="gentle"} onCheckedChange={checked=>onChange({...value,motion:checked?"gentle":"off"})}/></label>
    <label className="setting-row"><span>Mostrar tarefas concluídas<small>Mantenha suas conquistas visíveis no planejamento.</small></span><Switch checked={value.showCompleted} onCheckedChange={checked=>onChange({...value,showCompleted:checked})}/></label>
    <label className="setting-row"><span>Visualização compacta<small>Menos espaço entre tarefas no quadro semanal.</small></span><Switch checked={value.compact} onCheckedChange={checked=>onChange({...value,compact:checked})}/></label>
  </div>;
}
