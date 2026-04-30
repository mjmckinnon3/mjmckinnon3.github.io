/* ==========================================================
   IT 3203 Milestone 3 - External JavaScript
   Handles quiz grading, feedback, reset, and current year.
   ========================================================== */
document.addEventListener('DOMContentLoaded', () => {
  const year = document.querySelector('#year');
  if (year) year.textContent = new Date().getFullYear();
  const form = document.querySelector('#server-quiz');
  if (!form) return;
  const resultsPanel = document.querySelector('#quiz-results');
  const resultBanner = document.querySelector('#result-banner');
  const resultList = document.querySelector('#result-list');
  const resetButton = document.querySelector('#reset-button');
  const questions = [
    {id:'q1', prompt:'What model lets a user request services from a server?', answer:'client-server model', get:()=>text('q1'), check:v=>['client-server model','client server model','client-server'].includes(norm(v))},
    {id:'q2', prompt:'What was a major limitation of early centralized systems?', answer:'limited accessibility', get:()=>radio('q2'), check:v=>v==='limited accessibility'},
    {id:'q3', prompt:'What technology lets several virtual servers run on one physical server?', answer:'virtualization', get:()=>radio('q3'), check:v=>v==='virtualization'},
    {id:'q4', prompt:'What cloud feature lets resources grow or shrink with demand?', answer:'scalability', get:()=>radio('q4'), check:v=>v==='scalability'},
    {id:'q5', prompt:'Which are features of cloud-based systems?', answer:'Scalability, remote access, on-demand resources', get:()=>checks('q5'), check:v=>same(v,['Scalability','Remote access','On-demand resources'])}
  ];
  form.addEventListener('submit', e => {
    e.preventDefault();
    let correct = 0;
    resultList.innerHTML = '';
    questions.forEach((q,i)=>{
      const user = q.get();
      const ok = q.check(user);
      if (ok) correct++;
      const userText = Array.isArray(user) ? (user.length ? user.join(', ') : 'No selections made') : (user || 'No answer provided');
      const item = document.createElement('article');
      item.className = `result-item ${ok ? 'correct':'incorrect'}`;
      item.innerHTML = `<h3>Question ${i+1}</h3><p><strong>Prompt:</strong> ${q.prompt}</p><p><strong>Your answer:</strong> ${safe(userText)}</p><p><strong>Correct answer:</strong> ${q.answer}</p><p><strong>Result:</strong> ${ok ? 'Correct':'Incorrect'}</p>`;
      resultList.appendChild(item);
    });
    const pct = Math.round((correct/questions.length)*100);
    const passed = pct >= 70;
    resultsPanel.classList.add('visible');
    resultBanner.className = `result-banner ${passed ? 'status-pass':'status-fail'}`;
    resultBanner.innerHTML = `<h2>${passed ? 'PASS':'REVIEW NEEDED'}</h2><p><strong>Score:</strong> ${correct} / ${questions.length} (${pct}%)</p>`;
    resultsPanel.scrollIntoView({behavior:'smooth'});
  });
  resetButton.addEventListener('click',()=>{form.reset();resultsPanel.classList.remove('visible');resultBanner.innerHTML='';resultList.innerHTML='';});
  function text(id){return document.getElementById(id).value.trim()}
  function radio(name){const selected=document.querySelector(`input[name="${name}"]:checked`);return selected?selected.value:''}
  function checks(name){return Array.from(document.querySelectorAll(`input[name="${name}"]:checked`)).map(x=>x.value).sort()}
  function norm(v){return String(v).toLowerCase().replace(/\s+/g,' ').trim()}
  function same(a,b){return a.length===b.length && [...a].sort().every((v,i)=>v===[...b].sort()[i])}
  function safe(s){return String(s).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]))}
});
