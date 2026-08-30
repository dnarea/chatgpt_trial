import type { ContractSpec } from './contracts';
export const validTick=(price:number,tick:number)=>tick>0 && Math.abs(price/tick-Math.round(price/tick))<1e-8;
export const roundTick=(price:number,tick:number)=>tick?Math.round(price/tick)*tick:price;
export function calculate(spec:ContractSpec, account:number,riskPct:number,entry:number,stop:number,tp:number,lots:number,leverage:number,fx:number){
 const maxRisk=account*riskPct/100, distance=Math.abs(entry-stop), recommended=spec.verified&&distance&&fx&&spec.lotSize?Math.max(0,Math.floor(maxRisk/(distance*spec.lotSize*fx))):0;
 const selected=lots||recommended, quantity=selected*spec.lotSize, slLoss=distance*quantity*fx, potential=Math.abs(tp-entry)*quantity*fx, notional=entry*quantity*fx;
 return {maxRisk,recommended,quantity,slLoss,potential,notional,margin:leverage?notional/leverage:0,rr:slLoss?potential/slLoss:0,actualRisk:account?slLoss/account*100:0};
}
export function result(spec:ContractSpec,direction:'LONG'|'SHORT',entry:number,exit:number,qty:number,entryType:'maker'|'taker',exitType:'maker'|'taker',fx:number,funding=0,risk=0){const grossUsd=(direction==='LONG'?exit-entry:entry-exit)*qty;const entryFee=entry*qty*(entryType==='maker'?spec.makerFee:spec.takerFee)*fx;const exitFee=exit*qty*(exitType==='maker'?spec.makerFee:spec.takerFee)*fx;const gross=grossUsd*fx, fees=entryFee+exitFee,net=gross-fees+funding;return{gross,entryFee,exitFee,fees,net,grossR:risk?gross/risk:0,netR:risk?net/risk:0}}
