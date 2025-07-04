import{c as x,j as e,r as a,R as g,M as w}from"./assets/MarkdownViewer-0ppmWBDY.js";const m=({isOpen:n,onClose:t,review:o,loading:i})=>n?e.jsx("div",{style:{position:"fixed",top:0,left:0,right:0,bottom:0,backgroundColor:"rgba(0, 0, 0, 0.5)",zIndex:9999,display:"flex",alignItems:"center",justifyContent:"center"},onClick:t,children:e.jsxs("div",{style:{backgroundColor:"white",borderRadius:"8px",padding:"24px",maxWidth:"700px",maxHeight:"80vh",overflow:"auto",width:"90%"},onClick:s=>s.stopPropagation(),children:[e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"16px"},children:[e.jsx("h3",{style:{margin:0,fontSize:"18px",fontWeight:"600",color:"#1f2937"},children:"🔍 AI Code Review"}),e.jsx("button",{onClick:t,style:{background:"#e11d48",color:"white",border:"none",padding:"8px 16px",borderRadius:"6px",cursor:"pointer",fontWeight:"500"},children:"Close"})]}),i&&e.jsxs("div",{style:{display:"flex",alignItems:"center",justifyContent:"center",padding:"20px",color:"#6b7280"},children:[e.jsx("div",{style:{border:"2px solid #e5e7eb",borderTop:"2px solid #3b82f6",borderRadius:"50%",width:"20px",height:"20px",animation:"spin 1s linear infinite",marginRight:"8px"}}),e.jsx("span",{children:"Loading review..."})]}),o&&e.jsx("div",{style:{maxHeight:"60vh",overflow:"auto"},children:e.jsx(w,{content:o})}),e.jsx("style",{children:`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `})]})}):null,v=()=>{const[n,t]=a.useState(!1),[o,i]=a.useState(""),[s,d]=a.useState(!1),u=async()=>{const h=window.location.href;t(!0),d(!0),i("");try{const r=await fetch(`http://localhost:3000/api/github-diff?url=${encodeURIComponent(h)}`),c=await r.json();if(!r.ok||!c.diff)throw new Error("Failed to fetch diff");const l=await fetch("http://localhost:3000/api/review",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({diff:c.diff})}),p=await l.json();if(!l.ok||!p.review)throw new Error("Failed to get review");i(p.review)}catch(r){i(`❌ Error: ${r instanceof Error?r.message:"An error occurred"}`)}finally{d(!1)}};return g.useEffect(()=>{u()},[]),e.jsx(m,{isOpen:n,onClose:()=>t(!1),review:o,loading:s})};function f(){if(document.getElementById("ai-review-button"))return;const n=document.querySelector("div.gh-header-actions");if(!n)return;const t=document.createElement("button");t.id="ai-review-button",t.innerText="💡 Review with AI",t.style.cssText=`
    margin-left: 10px; 
    padding: 6px 12px; 
    background-color: #2c974b; 
    color: white; 
    border: none; 
    border-radius: 4px; 
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
  `,t.onclick=()=>{const o=document.createElement("div");o.id="ai-review-modal-container",document.body.appendChild(o),x.createRoot(o).render(e.jsx(v,{}))},n.appendChild(t)}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",()=>{setTimeout(f,1500)}):setTimeout(f,1500);
