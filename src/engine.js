(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;root.DealDesk=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
'use strict';
const required=['account','owner','region','useCase','estimatedValue','securityReview','commercialApproval','technicalScope','deliveryOwner'];
const stages=['GTM Brief','Deal Desk','Approved','Delivery Assigned'];
const enums={securityReview:['pending','approved','rejected'],commercialApproval:['pending','approved','rejected'],technicalScope:['confirmed','unconfirmed'],stage:stages};
const limits={'GTM Brief':2,'Deal Desk':3,Approved:2,'Delivery Assigned':5};
const text=v=>typeof v==='string'&&v.trim().length>0;
function evaluate(record){
 const gaps=required.filter(key=>key==='estimatedValue'?!(typeof record[key]==='number'&&Number.isFinite(record[key])&&record[key]>0):!text(record[key]));
 for(const [key,allowed] of Object.entries(enums)){if(!allowed.includes(record[key])&&!gaps.includes(key))gaps.push(key);}
 const validAge=typeof record.daysInStage==='number'&&Number.isFinite(record.daysInStage)&&record.daysInStage>=0;
 if(!validAge)gaps.push('daysInStage');
 const blockers=[];
 if(gaps.length)blockers.push('Missing or invalid fields: '+gaps.join(', '));
 if(record.securityReview==='pending')blockers.push('Security review awaiting approval');
 if(record.securityReview==='rejected')blockers.push('Security review rejected');
 if(record.technicalScope==='unconfirmed')blockers.push('Technical scope requires confirmation');
 if(record.commercialApproval==='pending')blockers.push('Commercial decision pending');
 if(record.commercialApproval==='rejected')blockers.push('Commercial approval rejected');
 const approved=record.commercialApproval==='approved'&&record.securityReview==='approved'&&record.technicalScope==='confirmed';
 const atDeliveryGate=record.stage==='Approved'||record.stage==='Delivery Assigned';
 const assigned=text(record.deliveryOwner)&&record.deliveryOwner.trim()!=='unassigned';
 const assignmentDue=!gaps.length&&approved&&atDeliveryGate&&!assigned;
 const ready=approved&&gaps.length===0&&assigned&&atDeliveryGate;
 let nextAction='Monitor delivery handoff',nextOwner=record.deliveryOwner;
 if(gaps.length){nextAction='Resolve input validity / routing completeness';nextOwner='GTM Operations';}
 else if(record.securityReview!=='approved'){nextAction='Obtain security decision';nextOwner='Security';}
 else if(record.technicalScope!=='confirmed'){nextAction='Confirm technical scope';nextOwner='Delivery Engineering';}
 else if(record.commercialApproval!=='approved'){nextAction='Complete commercial approval';nextOwner='Deal Desk';}
 else if(!atDeliveryGate){nextAction='Review evidence and reconcile approval stage';nextOwner='Deal Desk';}
 else if(!assigned){nextAction='Assign delivery owner';nextOwner='Engineering Program Manager';}
 const sla=limits[record.stage]??null,breached=validAge&&sla!==null&&record.daysInStage>sla;
 return {...record,gaps,blockers,ready,assignmentDue,nextAction,nextOwner,sla,breached,needsAttention:blockers.length>0||breached||assignmentDue};
}
function analyze(records){const rows=records.map(evaluate),ages=rows.filter(r=>typeof r.daysInStage==='number'&&Number.isFinite(r.daysInStage)&&r.daysInStage>=0);return {rows,metrics:{total:rows.length,ready:rows.filter(r=>r.ready).length,blocked:rows.filter(r=>r.blockers.length).length,missing:rows.filter(r=>r.gaps.length).length,overSla:rows.filter(r=>r.breached).length,avgDays:ages.length?+(ages.reduce((a,r)=>a+r.daysInStage,0)/ages.length).toFixed(1):0,stages:stages.map(stage=>({stage,count:rows.filter(r=>r.stage===stage).length})),unknownStages:rows.filter(r=>!stages.includes(r.stage)).length}};}
function simulatedNext(record){const r=evaluate(record);return {recordId:record.id,action:r.nextAction,owner:r.nextOwner,reason:r.blockers[0]||(r.assignmentDue?'Approved handoff requires delivery owner':r.breached?'Illustrative stage SLA exceeded':r.ready?'Readiness checks satisfied; continue monitoring':'Stage reconciliation requires review'),requiresHumanApproval:true,executed:false};}
return {required,stages,evaluate,analyze,simulatedNext};});
