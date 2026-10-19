(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;root.DealDesk=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
'use strict';
const required=['account','owner','region','useCase','estimatedValue','securityReview','commercialApproval','technicalScope','deliveryOwner'];
const stages=['GTM Brief','Deal Desk','Approved','Delivery Assigned'];
function evaluate(record){
 const gaps=[];
 for(const key of required){if(record[key]===undefined||record[key]===null||record[key]===''||(key==='estimatedValue'&&(!Number.isFinite(record[key])||record[key]<=0)))gaps.push(key);}
 const blockers=[];
 if(gaps.length)blockers.push('Missing or invalid required fields: '+gaps.join(', '));
 if(record.securityReview==='pending')blockers.push('Security review awaiting approval');
 if(record.securityReview==='rejected')blockers.push('Security review rejected');
 if(record.commercialApproval==='pending')blockers.push('Commercial decision pending');
 if(record.commercialApproval==='rejected')blockers.push('Commercial approval rejected');
 if(record.technicalScope==='unconfirmed')blockers.push('Technical scope requires confirmation');
 const approved=record.commercialApproval==='approved'&&record.securityReview==='approved'&&record.technicalScope==='confirmed';
 const ready=approved&&gaps.length===0&&record.deliveryOwner!=='unassigned';
 let nextAction='Monitor delivery assignment',nextOwner=record.deliveryOwner;
 if(gaps.length){nextAction='Resolve brief / routing completeness';nextOwner='GTM Operations';}
 else if(record.securityReview!=='approved'){nextAction='Obtain security decision';nextOwner='Security';}
 else if(record.technicalScope!=='confirmed'){nextAction='Confirm technical scope';nextOwner='Delivery Engineering';}
 else if(record.commercialApproval!=='approved'){nextAction='Complete commercial approval';nextOwner='Deal Desk';}
 else if(record.deliveryOwner==='unassigned'){nextAction='Assign delivery owner';nextOwner='Engineering Program Manager';}
 const days=Number.isFinite(record.daysInStage)?record.daysInStage:0;
 const sla=record.stage==='GTM Brief'?2:record.stage==='Deal Desk'?3:record.stage==='Approved'?2:5;
 return {...record,gaps,blockers,ready,nextAction,nextOwner,sla,breached:days>sla,needsAttention:blockers.length>0||days>sla||record.deliveryOwner==='unassigned'};
}
function analyze(records){const rows=records.map(evaluate);const count=s=>rows.filter(r=>r.stage===s).length;return {rows,metrics:{total:rows.length,ready:rows.filter(r=>r.ready).length,blocked:rows.filter(r=>r.blockers.length).length,missing:rows.filter(r=>r.gaps.length).length,overSla:rows.filter(r=>r.breached).length,avgDays:rows.length?+(rows.reduce((a,r)=>a+r.daysInStage,0)/rows.length).toFixed(1):0,stages:stages.map(s=>({stage:s,count:count(s)}))}};}
function simulatedNext(record){const current=evaluate(record);const event={recordId:record.id,action:current.nextAction,owner:current.nextOwner,reason:current.blockers[0]|| (current.breached?'Stage SLA exceeded':'Ready for next process step'),requiresHumanApproval:true,executed:false};return event;}
return {required,stages,evaluate,analyze,simulatedNext};});